<script setup>
import { ref, onBeforeUnmount, onMounted } from "vue";

// 聊天数据
const conversations = ref([]);
const currentConversationId = ref(null);
const messages = ref([]);
const newMessage = ref("");
const apiKey = "app-biXDlneU8keswQHN4sgMdxl5"; // 替换为您的API密钥
const userId = "user-123"; // 唯一用户标识符
let eventSource = null; // 用于处理流式响应

// 开始新聊天
const startNewChat = () => {
  currentConversationId.value = null;
  messages.value = [];
  conversations.value.push({
    id: null,
    name: "新对话",
    timestamp: new Date().toLocaleString(),
  });
};

// 选择对话
const selectConversation = async (conversationId) => {
  currentConversationId.value = conversationId;
  // 清空当前消息
  messages.value = [];
  
  if (!conversationId) return;
  
  try {
    // 从服务器获取历史消息
    const response = await fetch(`http://123.207.27.32/v1/conversations/${conversationId}/messages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('获取历史消息失败');
    }
    
    const data = await response.json();
    
    // 处理返回的消息数据并添加到消息列表
    if (data && Array.isArray(data.items)) {
      messages.value = data.items.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content
      }));
    }
  } catch (error) {
    console.error('获取历史消息时出错:', error);
    messages.value.push({
      id: Date.now(),
      role: 'assistant',
      content: '无法加载历史消息。'
    });
  }
};

// 发送消息到API
const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  // 将用户消息添加到聊天中
  messages.value.push({
    id: Date.now(),
    role: "user",
    content: newMessage.value,
  });

  const payload = {
    inputs: {},
    query: newMessage.value,
    response_mode: "streaming",
    conversation_id: currentConversationId.value || "",
    user: userId,
    files: [], // 如果需要，添加文件支持
    auto_generate_name: true,
  };

  try {
    // 关闭之前可能存在的 eventSource
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }

    // 使用 fetch 发送 POST 请求
    const response = await fetch(`http://123.207.27.32/v1/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 获取响应的可读流
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    // 读取流数据
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // 解码二进制数据为文本
      buffer += decoder.decode(value, { stream: true });
      
      // 处理缓冲区中的每一行数据
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // 最后一行可能不完整，保留到下一次处理
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.substring(6));
            handleStreamEvent(data);
          } catch (e) {
            console.error('解析事件数据失败:', e, line);
          }
        }
      }
    }
    
    // 处理最后可能剩余的数据
    if (buffer.trim() && buffer.trim().startsWith('data: ')) {
      try {
        const data = JSON.parse(buffer.trim().substring(6));
        handleStreamEvent(data);
      } catch (e) {
        console.error('解析最后的事件数据失败:', e, buffer);
      }
    }
  } catch (error) {
    console.error("发送消息时出错:", error);
    messages.value.push({
      id: Date.now(),
      role: "assistant",
      content: "发送消息失败。",
    });
  }

  // 清除输入
  newMessage.value = "";
};

// 处理流式事件
const handleStreamEvent = (data) => {
  switch (data.event) {
    case "message": {
      // 附加流式消息块
      const lastMessage = messages.value[messages.value.length - 1];
      if (lastMessage && lastMessage.role === "assistant") {
        lastMessage.content += data.answer;
      } else {
        messages.value.push({
          id: data.message_id,
          role: "assistant",
          content: data.answer,
        });
      }
      // 如果这是新对话，则更新对话ID
      if (!currentConversationId.value) {
        currentConversationId.value = data.conversation_id;
        conversations.value[conversations.value.length - 1].id =
          data.conversation_id;
      }
      break;
    }

    case "message_end":
      // 流已结束，不需要关闭 eventSource，因为我们现在使用的是 fetch API
      break;

    case "error":
      messages.value.push({
        id: Date.now(),
        role: "assistant",
        content: `错误: ${data.message}`,
      });
      break;

    case "ping":
      // 保持活动的ping，不做任何事情
      break;

    default:
      console.log("未处理的事件:", data.event);
  }
};

// 组件卸载前清理
onBeforeUnmount(() => {
  if (eventSource) {
    eventSource.close();
  }
});

// 初始化
onMounted(() => {
  startNewChat();
});
</script>

<template>
  <div class="py-2 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <!-- 主要聊天区域 -->
        <div class="row">
          <!-- 侧边栏对话列表 -->
          <div class="col-lg-3 mb-lg-0 mb-4">
            <div class="card">
              <div class="p-3 pb-0 card-header">
                <div class="d-flex justify-content-between align-items-center">
                  <h4 class="mb-2">对话列表</h4>
                  <button class="btn btn-sm btn-primary" @click="startNewChat">
                    <i class="ni ni-fat-add me-2"></i>新对话
                  </button>
                </div>
              </div>
              <div class="p-3 card-body conversation-list">
                <div
                  v-for="conv in conversations"
                  :key="conv.id"
                  @click="selectConversation(conv.id)"
                  :class="['conversation-item', { active: conv.id === currentConversationId }]"
                >
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="mb-0">{{ conv.name || "新对话" }}</h6>
                      <p class="text-xs text-secondary mb-0">{{ conv.timestamp }}</p>
                    </div>
                    <i class="ni ni-chat-round text-gradient text-primary"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 聊天主区域 -->
          <div class="col-lg-9">
            <div class="card">
              <div class="p-3 pb-0 card-header">
                <div class="d-flex justify-content-between">
                  <h4 class="mb-2">智能助教</h4>
                </div>
              </div>
              <div class="p-3 card-body chat-area">
                <div class="messages">
                  <div v-for="message in messages" :key="message.id" class="message">
                    <div v-if="message.role === 'user'" class="user-message">
                      <div class="message-content">{{ message.content }}</div>
                    </div>
                    <div v-else class="bot-message">
                      <div class="message-content">{{ message.content }}</div>
                    </div>
                  </div>
                </div>

                <!-- 输入区域 -->
                <div class="input-area">
                  <textarea
                    v-model="newMessage"
                    placeholder="输入您的问题..."
                    @keyup.enter="sendMessage"
                    class="form-control"
                    rows="3"
                  ></textarea>
                  <button @click="sendMessage" class="btn btn-primary">
                    <i class="ni ni-send me-2"></i>发送
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-area {
  display: flex;
  flex-direction: column;
  height: 70vh;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 15px;
}

.message {
  margin-bottom: 15px;
  display: flex;
}

.user-message {
  justify-content: flex-end;
  display: flex;
  width: 100%;
}

.bot-message {
  justify-content: flex-start;
  display: flex;
  width: 100%;
}

.message-content {
  padding: 12px 15px;
  border-radius: 10px;
  max-width: 80%;
  word-break: break-word;
}

.user-message .message-content {
  background-color: #5e72e4;
  color: white;
}

.bot-message .message-content {
  background-color: #f8f9fa;
  color: #344767;
}

.input-area {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.input-area textarea {
  flex: 1;
  resize: none;
}

.conversation-list {
  max-height: 70vh;
  overflow-y: auto;
}

.conversation-item {
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.conversation-item:hover {
  background-color: #f8f9fa;
}

.conversation-item.active {
  background-color: #e9ecef;
}
</style>