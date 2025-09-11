<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { baseRequest } from '@/utils/api';
import ArgonButton from '@/components/ArgonButton.vue';

const route = useRoute();
const groupId = route.params.groupId;

const members = ref([]);
const messages = ref([]);
const input = ref('');
const loading = ref(false);
const message = ref('');
const isSuccess = ref(true);
const currentPage = ref(1);
const pageSize = 50;
const hasMoreMessages = ref(true);
const chatContainer = ref(null);
const lastMessageId = ref(null);
const pollInterval = ref(null);
const isPolling = ref(true);

// 获取当前用户信息
const getCurrentUser = () => {
  const storage = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
  return storage ? JSON.parse(storage) : null;
};

const currentUser = getCurrentUser();

// 小组信息
const groupInfo = ref(null);

// 检查当前用户是否是创建者
const isCreator = () => {
  return currentUser && groupInfo.value && currentUser.id === groupInfo.value.createId;
};

// 踢出成员
const kickMember = async (memberId, memberName) => {
  if (!confirm(`确定要踢出成员"${memberName}"吗？`)) {
    return;
  }
  
  try {
    const response = await baseRequest.post('/studyGroup/kick', null, { 
      params: { groupId, memberId } 
    });
    
    if (response.status === 200) {
      message.value = `已踢出成员"${memberName}"`;
      isSuccess.value = true;
      // 重新加载成员列表
      await loadMembers();
    } else {
      message.value = response.msg || '踢出失败';
      isSuccess.value = false;
    }
  } catch (error) {
    console.error('踢出成员失败:', error);
    message.value = error.message || '踢出失败';
    isSuccess.value = false;
  }
};

// 获取用户显示信息（优先使用消息中的senderName，然后查找成员列表）
const getUserDisplayInfo = (senderId, senderName = null) => {
  let displayName = '';
  
  // 优先使用消息中的senderName
  if (senderName && senderName.trim()) {
    displayName = senderName;
  } else {
    // 查找成员信息
    const member = members.value.find(m => m.customerId === senderId);
    
    if (member && member.customerName) {
      displayName = member.customerName;
    } else {
      // 生成友好的显示名称
      displayName = `用户${senderId.substring(0, 6)}`;
    }
  }
  
  const shortName = displayName.length > 8 ? displayName.substring(0, 8) + '...' : displayName;
  
  return {
    name: shortName,
    fullName: displayName,
    avatar: getAvatarColor(senderId)
  };
};

// 根据用户ID生成头像颜色
const getAvatarColor = (userId) => {
  const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// 判断消息是否是当前用户发送的
const isMyMessage = (senderId) => {
  return currentUser && currentUser.id === senderId;
};

// 格式化时间显示
const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const date = new Date(timeStr);
  const now = new Date();
  const diff = now - date;
  
  // 如果是今天的消息，只显示时间
  if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  
  // 如果是昨天的消息
  if (diff < 48 * 60 * 60 * 1000) {
    return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  
  // 其他显示完整日期
  return date.toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// 加载小组信息
const loadGroupInfo = async () => {
  try {
    const groupRes = await baseRequest.post('/studyGroup/list', { pageType: '1', start: 0, pageSize: 1000 });
    if (groupRes.status === 200 && groupRes.data && groupRes.data.list) {
      const group = groupRes.data.list.find(g => g.id === groupId);
      if (group) {
        groupInfo.value = group;
      }
    }
  } catch (error) {
    console.error('加载小组信息失败:', error);
  }
};

// 加载成员信息（使用后端JOIN查询返回的用户名）
const loadMembers = async () => {
  try {
    const memRes = await baseRequest.post('/studyGroup/members', null, { params: { groupId } });
    const memberList = (memRes.data && memRes.data.list) ? memRes.data.list : [];
    
    // 后端已经通过JOIN查询返回了customerName，直接使用
    memberList.forEach((member, index) => {
      // 如果后端没有返回名字，使用备用名称
      if (!member.customerName) {
        const memberNames = ['小张', '小李', '小王', '小刘', '小陈', '小赵', '小孙', '小周'];
        member.customerName = memberNames[index % memberNames.length] || `成员${index + 1}`;
      }
    });
    
    console.log('加载的成员信息:', memberList); // 调试日志
    members.value = memberList;
  } catch (err) {
    console.error('加载成员失败', err);
    members.value = [];
  }
};

// 加载消息（支持分页）
const loadMessages = async (page = 1, append = false) => {
  try {
    if (!append) loading.value = true;
    
    const start = (page - 1) * pageSize;
    const msgRes = await baseRequest.post('/studyGroup/messages', null, { 
      params: { groupId, pageType: '1', start, pageSize: pageSize + 1 } // 多加载一条用于判断是否还有更多
    });
    
    const newMessages = (msgRes.data && msgRes.data.list) ? msgRes.data.list : [];
    
    // 检查是否还有更多消息
    if (newMessages.length <= pageSize) {
      hasMoreMessages.value = false;
    } else {
      newMessages.pop(); // 移除多余的一条
      hasMoreMessages.value = true;
    }
    
    if (append) {
      // 追加到现有消息前面（历史消息）
      messages.value = [...newMessages, ...messages.value];
    } else {
      messages.value = newMessages;
      // 滚动到底部
      nextTick(() => {
        if (chatContainer.value) {
          chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        }
      });
    }
    
    currentPage.value = page;
  } catch (err) {
    console.error('加载消息失败', err);
    message.value = err.message || '加载消息失败';
    isSuccess.value = false;
  } finally {
    if (!append) loading.value = false;
  }
};

// 加载更多历史消息
const loadMoreMessages = () => {
  if (hasMoreMessages.value && !loading.value) {
    loadMessages(currentPage.value + 1, true);
  }
};

// 完整加载函数
const load = async () => {
  await Promise.all([
    loadGroupInfo(),
    loadMembers(),
    loadMessages()
  ]);
};

const send = async () => {
  const content = input.value.trim();
  if (!content) return;
  
  try {
    loading.value = true;
    const res = await baseRequest.post('/studyGroup/send', null, { params: { groupId, content } });
    if (res.status === 200) {
      input.value = '';
      message.value = '';
      isSuccess.value = true;
      // 重新加载消息
      await loadMessages();
    } else {
      message.value = res.msg || '发送失败';
      isSuccess.value = false;
      console.error('发送失败:', res);
    }
  } catch (err) {
    console.error('发送失败', err);
    message.value = err.message || '网络错误，发送失败';
    isSuccess.value = false;
  } finally {
    loading.value = false;
  }
};

// 滚动事件处理（检测是否需要加载更多消息）
const onScroll = () => {
  if (chatContainer.value) {
    const { scrollTop } = chatContainer.value;
    // 如果滚动到顶部，自动加载更多历史消息
    if (scrollTop <= 50 && hasMoreMessages.value && !loading.value) {
      loadMoreMessages();
    }
  }
};

// 轮询获取新消息
const pollNewMessages = async () => {
  if (!isPolling.value || loading.value) return;
  
  try {
    const msgRes = await baseRequest.post('/studyGroup/messages', null, { 
      params: { groupId, pageType: '1', start: 0, pageSize: 10 } // 只获取最新10条
    });
    
    const newMessages = (msgRes.data && msgRes.data.list) ? msgRes.data.list : [];
    
    if (newMessages.length > 0) {
      // 检查是否有新消息
      const latestMessage = newMessages[newMessages.length - 1];
      if (lastMessageId.value && lastMessageId.value !== latestMessage.id) {
        // 有新消息，添加到消息列表
        const reallyNewMessages = newMessages.filter(msg => {
          const existingIndex = messages.value.findIndex(m => m.id === msg.id);
          return existingIndex === -1;
        });
        
        if (reallyNewMessages.length > 0) {
          messages.value.push(...reallyNewMessages.reverse());
          // 滚动到底部
          nextTick(() => {
            if (chatContainer.value) {
              chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
            }
          });
        }
      }
      lastMessageId.value = latestMessage.id;
    }
  } catch (err) {
    console.warn('轮询消息失败:', err);
  }
};

// 开始轮询
const startPolling = () => {
  if (pollInterval.value) return;
  
  pollInterval.value = setInterval(() => {
    pollNewMessages();
  }, 3000); // 每3秒轮询一次
};

// 停止轮询
const stopPolling = () => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value);
    pollInterval.value = null;
  }
};

// 页面可见性变化处理
const handleVisibilityChange = () => {
  if (document.hidden) {
    isPolling.value = false;
    stopPolling();
  } else {
    isPolling.value = true;
    startPolling();
    // 页面重新可见时，立即检查新消息
    pollNewMessages();
  }
};

onMounted(() => {
  load().then(() => {
    // 设置最后一条消息ID
    if (messages.value.length > 0) {
      lastMessageId.value = messages.value[messages.value.length - 1].id;
    }
    // 开始轮询
    startPolling();
  });
  
  // 监听页面可见性变化
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

// 组件卸载时清理
onUnmounted(() => {
  stopPolling();
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<template>
  <div class="py-2 container-fluid">
    <div class="row">
      <div class="col-12 col-lg-8">
        <div class="card mb-3 chat-card">
          <div class="card-header pb-0 d-flex align-items-center justify-content-between">
            <h5 class="mb-0">小组聊天</h5>
            <div class="d-flex align-items-center text-sm text-muted">
              <i class="fas fa-users me-1"></i>
              {{ members.length }} 人在线
            </div>
          </div>
          
          <!-- 聊天消息区域 -->
          <div ref="chatContainer" class="chat-messages" @scroll="onScroll">
            <!-- 加载更多按钮 -->
            <div v-if="hasMoreMessages" class="text-center py-2">
              <button 
                class="btn btn-link btn-sm text-muted" 
                @click="loadMoreMessages"
                :disabled="loading"
              >
                <i class="fas fa-chevron-up me-1"></i>
                加载更多历史消息
              </button>
            </div>
            
            <div v-if="loading && messages.length === 0" class="text-center text-muted py-4">
              <i class="fas fa-spinner fa-spin me-2"></i>加载中...
            </div>
            
            <div v-else-if="messages.length === 0" class="empty-chat">
              <i class="fas fa-comments mb-2"></i>
              <p>还没有消息，开始聊天吧！</p>
            </div>
            
            <!-- 消息列表 -->
            <div v-for="m in messages" :key="m.id" class="message-item" :class="{ 'my-message': isMyMessage(m.senderId) }">
              <div class="message-wrapper">
                <!-- 其他人的消息 -->
                <template v-if="!isMyMessage(m.senderId)">
                  <div class="message-avatar">
                    <div class="avatar-circle" :class="`bg-${getUserDisplayInfo(m.senderId, m.senderName).avatar}`">
                      {{ getUserDisplayInfo(m.senderId, m.senderName).name.charAt(0) }}
                    </div>
                  </div>
                  <div class="message-content">
                    <div class="message-header">
                      <span class="sender-name">{{ getUserDisplayInfo(m.senderId, m.senderName).name }}</span>
                      <span class="message-time">{{ formatTime(m.createTime) }}</span>
                    </div>
                    <div class="message-bubble other-bubble">
                      {{ m.content }}
                    </div>
                  </div>
                </template>
                
                <!-- 自己的消息 -->
                <template v-else>
                  <div class="message-content">
                    <div class="message-header text-end">
                      <span class="message-time">{{ formatTime(m.createTime) }}</span>
                      <span class="sender-name">我</span>
                    </div>
                    <div class="message-bubble my-bubble">
                      {{ m.content }}
                    </div>
                  </div>
                  <!-- 移除自己消息的头像圆圈 -->
                </template>
              </div>
            </div>
          </div>
          
          <!-- 输入区域 -->
          <div class="card-footer chat-input">
            <!-- 错误消息显示 -->
            <div v-if="message && !isSuccess" class="alert alert-danger alert-sm mb-2">
              {{ message }}
            </div>
            
            <div class="input-group">
              <input 
                class="form-control" 
                v-model.trim="input" 
                placeholder="输入消息..." 
                @keyup.enter="send"
                :disabled="loading"
                maxlength="500"
              />
              <ArgonButton 
                color="success" 
                size="sm" 
                @click="send"
                :disabled="!input.trim() || loading"
              >
                <i v-if="loading" class="fas fa-spinner fa-spin me-1"></i>
                <i v-else class="fas fa-paper-plane me-1"></i>
                {{ loading ? '发送中...' : '发送' }}
              </ArgonButton>
            </div>
            <div class="char-count text-muted text-xs mt-1">
              {{ input.length }}/500
            </div>
          </div>
        </div>
      </div>
      
      <!-- 成员列表 -->
      <div class="col-12 col-lg-4">
        <div class="card">
          <div class="card-header pb-0">
            <h5 class="mb-0">
              <i class="fas fa-users me-2"></i>成员列表
            </h5>
          </div>
          <div class="card-body member-list">
            <div v-for="mem in members" :key="mem.id" class="member-item">
              <div class="d-flex align-items-center">
                <div class="member-avatar">
                  <div class="avatar-circle" :class="`bg-${getAvatarColor(mem.customerId)}`">
                    {{ (mem.customerName || mem.customerId).charAt(0) }}
                  </div>
                </div>
                <div class="member-info">
                  <div class="member-name">{{ mem.customerName || mem.customerId }}</div>
                  <div class="member-role">
                    <i class="fas fa-crown me-1" v-if="groupInfo && mem.customerId === groupInfo.createId"></i>
                    <i class="fas fa-user-tag me-1" v-else></i>
                    {{ groupInfo && mem.customerId === groupInfo.createId ? '创建者' : '成员' }}
                  </div>
                </div>
                <div class="member-status d-flex align-items-center">
                  <div v-if="currentUser && currentUser.id === mem.customerId" class="status-indicator online me-2"></div>
                  <div v-else class="status-indicator me-2"></div>
                  <!-- 踢出按钮：只有创建者可以踢出其他成员，不能踢出自己 -->
                  <button 
                    v-if="isCreator() && mem.customerId !== currentUser?.id" 
                    class="btn btn-sm btn-outline-danger"
                    @click="kickMember(mem.customerId, mem.customerName)"
                    title="踢出成员"
                  >
                    <i class="fas fa-user-times"></i>
                  </button>
                </div>
              </div>
            </div>
            <div v-if="members.length === 0" class="text-center text-muted py-3">
              <i class="fas fa-user-slash mb-2"></i>
              <p>暂无成员</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card { 
  box-shadow: 0 20px 27px 0 rgb(0 0 0 / 5%); 
  border-radius: 15px;
}

/* 聊天卡片 */
.chat-card {
  height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
}

.chat-messages {
  min-height: 400px;
  max-height: calc(100vh - 260px);
  overflow-y: auto;
  padding: 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  scroll-behavior: smooth;
}

/* 空聊天状态 */
.empty-chat {
  text-align: center;
  color: #8392ab;
  padding: 3rem 1rem;
  font-size: 1.1rem;
}

.empty-chat i {
  font-size: 3rem;
  opacity: 0.5;
}

/* 消息项 */
.message-item {
  margin-bottom: 1rem;
  animation: fadeInUp 0.3s ease-out;
}

.message-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.my-message .message-wrapper {
  flex-direction: row;
  justify-content: flex-end; /* 右对齐自己的消息 */
  gap: 0; /* 移除间距，因为没有头像 */
}

/* 头像 */
.message-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* 消息内容 */
.message-content {
  flex: 1;
  max-width: 70%;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 防止子项（气泡）在横向被拉伸，按内容自适应 */
}

.my-message .message-content {
  text-align: right;
  max-width: 65%; /* 自己的消息气泡稍微短一些 */
  align-items: flex-end; /* 右对齐气泡 */
}

.message-header {
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
  color: #8392ab;
}

.sender-name {
  font-weight: 600;
  margin-right: 0.5rem;
}

.my-message .sender-name {
  margin-right: 0;
  margin-left: 0.5rem;
}

.message-time {
  color: #adb5bd;
}

/* 消息气泡 */
.message-bubble {
  padding: 0.75rem 1rem;
  border-radius: 18px;
  word-wrap: break-word;
  word-break: break-word;
  line-height: 1.4;
  position: relative;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  display: inline-block;
  min-width: 60px;
  max-width: 300px; /* 设置一个合理的最大宽度 */
  width: auto; /* 根据内容自适应宽度 */
}

.other-bubble {
  background: white;
  border: 1px solid #e9ecef;
  margin-left: 0.5rem;
  max-width: 300px; /* 与消息气泡基础样式保持一致，根据内容自适应 */
}

.other-bubble::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 12px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 6px 8px 6px 0;
  border-color: transparent white transparent transparent;
}

.my-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-right: 0; /* 移除右边距，因为没有头像了 */
  max-width: 300px; /* 与其他消息气泡保持一致，根据内容自适应 */
}

.my-bubble::after {
  content: '';
  position: absolute;
  right: -8px;
  top: 12px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 6px 0 6px 8px;
  border-color: transparent transparent transparent #667eea;
}

/* 输入区域 */
.chat-input {
  background: white;
  border-top: 1px solid #e9ecef;
  padding: 1rem;
}

.alert-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
}

.input-group {
  gap: 0.5rem;
}

.input-group .form-control {
  border-radius: 25px;
  border: 1px solid #e9ecef;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.input-group .form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.char-count {
  text-align: right;
  font-size: 0.7rem;
}

/* 成员列表 */
.member-list {
  max-height: calc(100vh - 260px);
  overflow-y: auto;
  padding: 1rem;
}

.member-item {
  padding: 0.75rem;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.member-item:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.member-avatar .avatar-circle {
  width: 36px;
  height: 36px;
  font-size: 0.8rem;
}

.member-info {
  flex: 1;
  margin-left: 0.75rem;
}

.member-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #344767;
}

.member-role {
  font-size: 0.75rem;
  color: #8392ab;
}

.member-role .fa-crown {
  color: #ffc107;
  text-shadow: 0 0 3px rgba(255, 193, 7, 0.5);
}

.member-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.member-status .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.member-status .btn:hover {
  transform: scale(1.1);
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #adb5bd;
}

.status-indicator.online {
  background: #28a745;
  box-shadow: 0 0 0 2px white, 0 0 0 4px #28a745;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 颜色主题 */
.bg-primary { background-color: #667eea !important; }
.bg-secondary { background-color: #6c757d !important; }
.bg-success { background-color: #28a745 !important; }
.bg-danger { background-color: #dc3545 !important; }
.bg-warning { background-color: #ffc107 !important; color: #000 !important; }
.bg-info { background-color: #17a2b8 !important; }
.bg-light { background-color: #f8f9fa !important; color: #000 !important; }
.bg-dark { background-color: #343a40 !important; }

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-card {
    height: calc(100vh - 120px);
  }
  
  .chat-messages {
    max-height: calc(100vh - 220px);
  }
  
  .message-content {
    max-width: 85%;
  }
  
  .my-message .message-content {
    max-width: 80%; /* 移动端自己的消息稍微短一些 */
  }
  
  .message-bubble {
    max-width: 250px; /* 移动端最大宽度稍小 */
  }
  
  .member-list {
    max-height: 300px;
  }
}

/* 滚动条美化 */
.chat-messages::-webkit-scrollbar,
.member-list::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track,
.member-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb,
.member-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover,
.member-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>


