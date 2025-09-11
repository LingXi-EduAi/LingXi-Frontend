<script setup>
import { ref, computed } from "vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonBadge from "@/components/ArgonBadge.vue";
import ArgonInput from "@/components/ArgonInput.vue";

// 搜索和筛选
const searchQuery = ref('');
const selectedCategory = ref('all');

// 创建小组对话框
const showCreateGroupDialog = ref(false);
const newGroup = ref({
  name: '',
  description: '',
  category: '语文',
  maxMembers: 5
});

// 加入小组对话框
const showJoinGroupDialog = ref(false);
const selectedGroupToJoin = ref(null);

// 小组分类
const groupCategories = [
  '语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治', '其他'
];

// 我的学习小组数据
const myGroups = ref([
  {
    id: 1,
    name: "高三数学竞赛小组",
    description: "专注于数学竞赛题目讨论和解析，适合有志于参加数学竞赛的同学",
    category: "数学",
    memberCount: 4,
    maxMembers: 5,
    creator: "张明",
    createTime: "2023-09-15",
    lastActiveTime: "2023-10-01"
  },
  {
    id: 2,
    name: "英语口语练习小组",
    description: "每周定期进行英语口语练习，提高英语口语表达能力和听力水平",
    category: "英语",
    memberCount: 3,
    maxMembers: 6,
    creator: "李华",
    createTime: "2023-08-20",
    lastActiveTime: "2023-09-28"
  }
]);

// 推荐学习小组数据
const recommendedGroups = ref([
  {
    id: 3,
    name: "物理实验探究小组",
    description: "一起探讨物理实验现象，分享实验心得，解决实验中遇到的问题",
    category: "物理",
    memberCount: 4,
    maxMembers: 8,
    creator: "王强",
    createTime: "2023-09-10",
    lastActiveTime: "2023-09-30"
  },
  {
    id: 4,
    name: "语文阅读分享会",
    description: "分享优秀文学作品，交流阅读心得，提高语文阅读理解和写作能力",
    category: "语文",
    memberCount: 5,
    maxMembers: 10,
    creator: "赵敏",
    createTime: "2023-07-15",
    lastActiveTime: "2023-09-25"
  },
  {
    id: 5,
    name: "化学竞赛研究小组",
    description: "专注于化学竞赛题目研究，包括实验设计和理论分析",
    category: "化学",
    memberCount: 3,
    maxMembers: 6,
    creator: "刘芳",
    createTime: "2023-08-05",
    lastActiveTime: "2023-09-20"
  },
  {
    id: 6,
    name: "历史探究小组",
    description: "探讨历史事件和人物，分享历史知识，提高历史思维能力",
    category: "历史",
    memberCount: 4,
    maxMembers: 8,
    creator: "陈明",
    createTime: "2023-09-01",
    lastActiveTime: "2023-09-18"
  }
]);

// 获取分类对应的颜色
const getCategoryColor = (category) => {
  const categoryColors = {
    "语文": "primary",
    "数学": "success",
    "英语": "info",
    "物理": "warning",
    "化学": "danger",
    "生物": "success",
    "历史": "primary",
    "地理": "info",
    "政治": "warning",
    "其他": "secondary"
  };
  return categoryColors[category] || "secondary";
};

// 筛选我的学习小组
const filteredMyGroups = computed(() => {
  return myGroups.value.filter(group => {
    const matchesSearch = searchQuery.value === '' || 
      group.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
      group.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = selectedCategory.value === 'all' || group.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});

// 筛选推荐学习小组
const filteredRecommendedGroups = computed(() => {
  return recommendedGroups.value.filter(group => {
    const matchesSearch = searchQuery.value === '' || 
      group.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
      group.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = selectedCategory.value === 'all' || group.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});

// 创建小组
const createGroup = () => {
  // 这里应该有API调用来创建小组
  const newGroupData = {
    id: myGroups.value.length + recommendedGroups.value.length + 1,
    name: newGroup.value.name,
    description: newGroup.value.description,
    category: newGroup.value.category,
    memberCount: 1,
    maxMembers: newGroup.value.maxMembers,
    creator: "当前用户", // 实际应用中应该是当前登录用户
    createTime: new Date().toISOString().split('T')[0],
    lastActiveTime: new Date().toISOString().split('T')[0]
  };
  
  myGroups.value.push(newGroupData);
  showCreateGroupDialog.value = false;
  
  // 重置表单
  newGroup.value = {
    name: '',
    description: '',
    category: '语文',
    maxMembers: 5
  };
};

// 加入小组
const joinGroup = () => {
  if (!selectedGroupToJoin.value) return;
  
  // 这里应该有API调用来加入小组
  const groupToMove = recommendedGroups.value.find(g => g.id === selectedGroupToJoin.value.id);
  if (groupToMove) {
    // 增加成员数
    groupToMove.memberCount += 1;
    
    // 从推荐小组中移除
    const index = recommendedGroups.value.findIndex(g => g.id === selectedGroupToJoin.value.id);
    if (index !== -1) {
      recommendedGroups.value.splice(index, 1);
    }
    
    // 添加到我的小组
    myGroups.value.push(groupToMove);
  }
  
  showJoinGroupDialog.value = false;
  selectedGroupToJoin.value = null;
};

// 打开加入小组对话框
const openJoinGroupDialog = (group) => {
  selectedGroupToJoin.value = group;
  showJoinGroupDialog.value = true;
};

// 退出小组
const leaveGroup = (groupId) => {
  // 这里应该有API调用来退出小组
  const index = myGroups.value.findIndex(g => g.id === groupId);
  if (index !== -1) {
    const groupToLeave = myGroups.value[index];
    
    // 减少成员数
    groupToLeave.memberCount -= 1;
    
    // 从我的小组中移除
    myGroups.value.splice(index, 1);
    
    // 如果不是创建者，可以添加到推荐小组
    if (groupToLeave.creator !== "当前用户") {
      recommendedGroups.value.push(groupToLeave);
    }
  }
};
</script>

<template>
  <div class="py-2 container-fluid">
    <div class="row mb-2">
      <div class="col-12 mb-3">
        <div class="card">
          <div class="card-header pb-0">
            <h4 class="mb-0">学习小组</h4>
          </div>
          <div class="card-body pt-3">
            <p class="text-sm mb-0">
              欢迎来到学习小组，这里您可以加入或创建学习小组，与志同道合的同学一起学习、讨论和分享知识。
            </p>
            
            <!-- 搜索和筛选工具栏 -->
            <div class="row mt-3">
              <div class="col-md-5 col-sm-12 mb-0">
                <ArgonInput
                  v-model="searchQuery"
                  placeholder="搜索小组名称或描述..."
                  icon="fas fa-search"
                  size="lg"
                />
              </div>
              <div class="col-md-5 col-sm-12 mb-3">
                <div class="d-flex align-items-center">
                  <label class="me-2 text-sm text-nowrap">按学科筛选:</label>
                  <select v-model="selectedCategory" class="form-select">
                    <option value="all">全部学科</option>
                    <option v-for="category in groupCategories" :key="category" :value="category">{{ category }}</option>
                  </select>
                </div>
              </div>
              <div class="col-md-2 col-sm-12 mb-3 text-end">
                <ArgonButton color="success" size="md" @click="showCreateGroupDialog = true">
                  <i class="fas fa-plus me-2"></i>创建小组
                </ArgonButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的学习小组部分 -->
    <div class="row mt-2 mb-4">
      <div class="col-12">
        <div class="card mb-3">
          <div class="card-header pb-0">
            <div class="d-flex align-items-center">
              <h4 class="mb-2">我的学习小组</h4>
              <span class="ms-2">
                <ArgonBadge color="primary" size="sm">{{ filteredMyGroups.length }}个小组</ArgonBadge>
              </span>
            </div>
            <p class="text-sm mb-2 mt-1">
              您已加入的学习小组，可以查看小组活动、参与讨论和分享资料
            </p>
          </div>
          <div class="card-body">
            <div class="row">
              <template v-if="filteredMyGroups.length > 0">
                <div v-for="group in filteredMyGroups" :key="group.id" class="col-lg-6 col-xl-4 mb-4">
                  <div class="card h-100 group-card">
                    <div class="card-header pb-0 pt-3">
                      <div class="d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">{{ group.name }}</h5>
                        <ArgonBadge :color="getCategoryColor(group.category)" size="sm">{{ group.category }}</ArgonBadge>
                      </div>
                    </div>
                    <div class="card-body">
                      <p class="text-sm mb-3">{{ group.description }}</p>
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-muted">成员: {{ group.memberCount }}/{{ group.maxMembers }}</small>
                        <small class="text-muted">创建者: {{ group.creator }}</small>
                      </div>
                      <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">创建时间: {{ group.createTime }}</small>
                        <small class="text-muted">最近活动: {{ group.lastActiveTime }}</small>
                      </div>
                    </div>
                    <div class="card-footer pt-0">
                      <div class="d-flex justify-content-between">
                        <ArgonButton color="info" size="sm" variant="outline">
                          <i class="fas fa-comments me-1"></i>进入小组
                        </ArgonButton>
                        <ArgonButton color="danger" size="sm" variant="outline" @click="leaveGroup(group.id)">
                          <i class="fas fa-sign-out-alt me-1"></i>退出小组
                        </ArgonButton>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="col-12">
                  <div class="empty-state">
                    <i class="ni ni-single-copy-04 mb-2" style="font-size: 2rem;"></i>
                    <p>您还没有加入任何学习小组</p>
                    <ArgonButton color="success" size="sm" @click="showCreateGroupDialog = true">
                      创建一个小组
                    </ArgonButton>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐学习小组部分 -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card mb-3">
          <div class="card-header pb-0">
            <div class="d-flex align-items-center">
              <h4 class="mb-2">推荐学习小组</h4>
              <span class="ms-2">
                <ArgonBadge color="warning" size="sm">{{ filteredRecommendedGroups.length }}个小组</ArgonBadge>
              </span>
            </div>
            <p class="text-sm mb-2 mt-1">
              根据您的学习情况推荐的学习小组，您可以选择加入感兴趣的小组
            </p>
          </div>
          <div class="card-body">
            <div class="row">
              <template v-if="filteredRecommendedGroups.length > 0">
                <div v-for="group in filteredRecommendedGroups" :key="group.id" class="col-lg-6 col-xl-4 mb-4">
                  <div class="card h-100 group-card">
                    <div class="card-header pb-0 pt-3">
                      <div class="d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">{{ group.name }}</h5>
                        <ArgonBadge :color="getCategoryColor(group.category)" size="sm">{{ group.category }}</ArgonBadge>
                      </div>
                    </div>
                    <div class="card-body">
                      <p class="text-sm mb-3">{{ group.description }}</p>
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-muted">成员: {{ group.memberCount }}/{{ group.maxMembers }}</small>
                        <small class="text-muted">创建者: {{ group.creator }}</small>
                      </div>
                      <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">创建时间: {{ group.createTime }}</small>
                        <small class="text-muted">最近活动: {{ group.lastActiveTime }}</small>
                      </div>
                    </div>
                    <div class="card-footer pt-0">
                      <div class="d-flex justify-content-end">
                        <ArgonButton color="success" size="sm" variant="outline" @click="openJoinGroupDialog(group)">
                          <i class="fas fa-user-plus me-1"></i>加入小组
                        </ArgonButton>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="col-12">
                  <div class="empty-state">
                    <i class="ni ni-books mb-2" style="font-size: 2rem;"></i>
                    <p>没有找到符合条件的推荐小组</p>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建小组对话框 -->
    <div class="modal fade" :class="{ 'show d-block': showCreateGroupDialog }" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">创建学习小组</h5>
            <button type="button" class="btn-close" @click="showCreateGroupDialog = false" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="form-group mb-3">
              <label for="groupName" class="form-control-label">小组名称</label>
              <ArgonInput id="groupName" v-model="newGroup.name" placeholder="请输入小组名称" />
            </div>
            <div class="form-group mb-3">
              <label for="groupDescription" class="form-control-label">小组描述</label>
              <textarea id="groupDescription" v-model="newGroup.description" class="form-control" rows="3" placeholder="请输入小组描述"></textarea>
            </div>
            <div class="form-group mb-3">
              <label for="groupCategory" class="form-control-label">学科分类</label>
              <select id="groupCategory" v-model="newGroup.category" class="form-select">
                <option v-for="category in groupCategories" :key="category" :value="category">{{ category }}</option>
              </select>
            </div>
            <div class="form-group mb-3">
              <label for="groupMaxMembers" class="form-control-label">最大成员数</label>
              <select id="groupMaxMembers" v-model="newGroup.maxMembers" class="form-select">
                <option v-for="num in 10" :key="num" :value="num">{{ num }}人</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showCreateGroupDialog = false">取消</button>
            <button type="button" class="btn btn-primary" @click="createGroup()" :disabled="!newGroup.name || !newGroup.description">创建</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" :class="{ 'show': showCreateGroupDialog }" v-if="showCreateGroupDialog"></div>

    <!-- 加入小组对话框 -->
    <div class="modal fade" :class="{ 'show d-block': showJoinGroupDialog }" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">加入学习小组</h5>
            <button type="button" class="btn-close" @click="showJoinGroupDialog = false" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedGroupToJoin">
            <p>您确定要加入 <strong>{{ selectedGroupToJoin.name }}</strong> 学习小组吗？</p>
            <div class="alert alert-info">
              <p class="mb-0"><strong>小组描述：</strong>{{ selectedGroupToJoin.description }}</p>
              <p class="mb-0 mt-2"><strong>学科分类：</strong>{{ selectedGroupToJoin.category }}</p>
              <p class="mb-0 mt-2"><strong>成员数量：</strong>{{ selectedGroupToJoin.memberCount }}/{{ selectedGroupToJoin.maxMembers }}</p>
              <p class="mb-0 mt-2"><strong>创建者：</strong>{{ selectedGroupToJoin.creator }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showJoinGroupDialog = false">取消</button>
            <button type="button" class="btn btn-success" @click="joinGroup()">确认加入</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" :class="{ 'show': showJoinGroupDialog }" v-if="showJoinGroupDialog"></div>
  </div>
</template>

<style scoped>
.card {
  box-shadow: 0 20px 27px 0 rgb(0 0 0 / 5%);
  transition: all 0.2s ease-in-out;
}

.card:hover {
  box-shadow: 0 30px 35px 0 rgb(0 0 0 / 7%);
}

.group-card {
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s;
}

.group-card:hover {
  transform: translateY(-5px);
}

.form-select {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #d2d6da;
  font-size: 0.875rem;
}

/* 标题样式 */
h4 {
  font-weight: 600;
  color: #344767;
}

/* 空状态样式 */
.empty-state {
  padding: 2rem;
  text-align: center;
  color: #8392ab;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
  }
}

/* 模态框样式 */
.modal-backdrop.show {
  opacity: 0.5;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal.show {
  display: block;
}

/* 卡片内容间距调整 */
.card-body {
  padding: 1.5rem;
}

.card-footer {
  background-color: transparent;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1rem 1.5rem;
}
</style>