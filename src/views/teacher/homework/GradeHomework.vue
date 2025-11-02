<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ArgonButton from '@/components/ArgonButton.vue';
import ArgonBadge from '@/components/ArgonBadge.vue';
import ArgonInput from '@/components/ArgonInput.vue';
import { baseRequest } from '@/utils/api';

const router = useRouter();

// 搜索和筛选
const searchQuery = ref('');
const selectedSubject = ref('all');
const selectedStatus = ref('all');
const selectedAssignment = ref('all');

// 加载状态
const loading = ref(false);
const submitting = ref(false);

// 作业列表
const assignmentList = ref([]);

// 提交列表
const submissionList = ref([]);

// 批改对话框
const showGradeDialog = ref(false);
const currentSubmission = ref(null);
const gradeForm = ref({
  grade: null,
  feedback: ''
});

// AI初评对话框
const showAIDialog = ref(false);
const aiEvaluationText = ref('');
const currentAssignmentContent = ref('');

// 学科列表
const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治', '其他'];

// 状态列表
const statusList = [
  { id: 'submitted', label: '待批改', color: 'warning' },
  { id: 'graded', label: '已批改', color: 'success' }
];

// 获取状态颜色
const getStatusColor = (status) => {
  const statusObj = statusList.find(s => s.id === status);
  return statusObj ? statusObj.color : 'secondary';
};

// 获取状态文本
const getStatusText = (status) => {
  const statusObj = statusList.find(s => s.id === status);
  return statusObj ? statusObj.label : '未知';
};

// 获取学科颜色
const getSubjectColor = (subject) => {
  const colors = {
    "语文": "primary",
    "数学": "success",
    "英语": "info",
    "物理": "warning",
    "化学": "danger",
    "其他": "secondary"
  };
  return colors[subject] || "secondary";
};

// 筛选提交列表
const filteredSubmissions = computed(() => {
  return submissionList.value.filter(submission => {
    const matchesSearch = searchQuery.value === '' || 
      submission.studentName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      submission.assignmentTitle?.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesSubject = selectedSubject.value === 'all' || submission.subject === selectedSubject.value;
    const matchesStatus = selectedStatus.value === 'all' || submission.status === selectedStatus.value;
    const matchesAssignment = selectedAssignment.value === 'all' || submission.assignmentId === selectedAssignment.value;
    return matchesSearch && matchesSubject && matchesStatus && matchesAssignment;
  });
});

// 加载作业列表
const loadAssignments = async () => {
  try {
    const response = await baseRequest.post('/homework/assignment/list', {
      currentPage: 1,
      pageSize: 100
    });
    
    if (response.status === 200 && response.data && response.data.list) {
      assignmentList.value = response.data.list;
    }
  } catch (error) {
    console.error('加载作业列表失败:', error);
  }
};

// 加载提交列表
const loadSubmissions = async () => {
  loading.value = true;
  try {
    const response = await baseRequest.post('/homework/submission/list', {
      currentPage: 1,
      pageSize: 100
    });
    
    if (response.status === 200 && response.data && response.data.list) {
      // 合并作业信息
      submissionList.value = response.data.list.map(submission => {
        const assignment = assignmentList.value.find(a => a.id === submission.assignmentId);
        return {
          ...submission,
          assignmentTitle: assignment?.title || '未知作业',
          subject: assignment?.subject || '其他'
        };
      });
    }
  } catch (error) {
    console.error('加载提交列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 打开批改对话框
const openGradeDialog = (submission) => {
  currentSubmission.value = submission;
  gradeForm.value = {
    grade: submission.grade || null,
    feedback: submission.feedback || ''
  };
  showGradeDialog.value = true;
  document.body.classList.add('modal-open');
};

// 关闭批改对话框
const closeGradeDialog = () => {
  showGradeDialog.value = false;
  currentSubmission.value = null;
  gradeForm.value = {
    grade: null,
    feedback: ''
  };
  document.body.classList.remove('modal-open');
};

// 提交批改
const submitGrade = async () => {
  if (gradeForm.value.grade === null || gradeForm.value.grade === '') {
    alert('请输入成绩');
    return;
  }
  
  const grade = Number(gradeForm.value.grade);
  if (isNaN(grade) || grade < 0 || grade > 100) {
    alert('成绩必须在0-100之间');
    return;
  }
  
  submitting.value = true;
  
  try {
    const response = await baseRequest.post('/homework/submission/grade', {
      id: currentSubmission.value.id,
      grade: grade,
      feedback: gradeForm.value.feedback,
      version: currentSubmission.value.version
    });
    
    if (response.status === 200) {
      alert('批改成功！');
      closeGradeDialog();
      await loadSubmissions(); // 重新加载列表
    } else {
      alert(response.msg || '批改失败');
    }
  } catch (error) {
    console.error('批改失败:', error);
    alert('批改失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
};

// 查看详情
const viewDetail = (submission) => {
  // 可以实现一个详情对话框或跳转到详情页面
  openGradeDialog(submission);
};

// 打开AI初评对话框
const openAIDialog = () => {
  if (!currentSubmission.value) {
    alert('请先选择一个作业');
    return;
  }
  
  // 获取当前作业的详细题目
  const assignment = assignmentList.value.find(a => a.id === currentSubmission.value.assignmentId);
  currentAssignmentContent.value = assignment?.content || '无法获取作业内容';
  
  // 构建AI评估文本
  aiEvaluationText.value = `请帮我评估以下学生作业：

【作业题目】
${currentAssignmentContent.value}

【学生姓名】
${currentSubmission.value.studentName}

【学生答案】
${currentSubmission.value.content || '学生未提交文字内容'}

请从以下几个方面进行评估：
1. 答题的完整性和准确性
2. 建议的分数（满分100分）
3. 每个题目的具体得分（请根据题目分值给出每题的得分）
4. 具体的优点和不足
5. 给学生的改进建议`;

  showAIDialog.value = true;
  document.body.classList.add('modal-open');
  
  // 隐藏左侧导航栏
  const sidebar = document.querySelector('.sidenav');
  if (sidebar) {
    sidebar.style.display = 'none';
  }
};

// 关闭AI初评对话框
const closeAIDialog = () => {
  showAIDialog.value = false;
  aiEvaluationText.value = '';
  document.body.classList.remove('modal-open');
  
  // 恢复显示左侧导航栏
  const sidebar = document.querySelector('.sidenav');
  if (sidebar) {
    sidebar.style.display = '';
  }
};

// 复制评估文本到剪贴板
const copyToClipboard = () => {
  navigator.clipboard.writeText(aiEvaluationText.value).then(() => {
    alert('已复制到剪贴板！请粘贴到AI聊天框中。');
  }).catch(err => {
    console.error('复制失败:', err);
    alert('复制失败，请手动复制文本');
  });
};

// 格式化日期
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '';
  
  try {
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return dateTimeStr;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    return dateTimeStr;
  }
};

// 格式化文本为HTML（支持简单的markdown格式）
const formatText = (text) => {
  if (!text) return '';
  
  let formatted = text;
  
  // 转义HTML特殊字符
  formatted = formatted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // 处理标题（### 、## 、# ）
  formatted = formatted.replace(/^### (.+)$/gm, '<h5 class="mt-3 mb-2 fw-bold">$1</h5>');
  formatted = formatted.replace(/^## (.+)$/gm, '<h4 class="mt-3 mb-2 fw-bold">$1</h4>');
  formatted = formatted.replace(/^# (.+)$/gm, '<h3 class="mt-3 mb-2 fw-bold">$1</h3>');
  
  // 处理粗体 **text**
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // 处理【标题】格式
  formatted = formatted.replace(/【(.+?)】/g, '<strong class="text-primary">【$1】</strong>');
  
  // 处理列表项（数字列表和点列表）
  formatted = formatted.replace(/^(\d+)\.\s+(.+)$/gm, '<div class="list-item"><span class="list-number">$1.</span> $2</div>');
  formatted = formatted.replace(/^[•·]\s+(.+)$/gm, '<div class="list-item"><span class="list-bullet">•</span> $1</div>');
  
  // 处理换行
  formatted = formatted.replace(/\n/g, '<br>');
  
  // 处理分数格式（例如：20分、(20分)）
  formatted = formatted.replace(/（(\d+)分）/g, '<span class="score-tag">（$1分）</span>');
  formatted = formatted.replace(/(\d+)分/g, '<span class="score-tag">$1分</span>');
  
  // 处理✓和✗符号
  formatted = formatted.replace(/✓/g, '<i class="fas fa-check text-success"></i>');
  formatted = formatted.replace(/✗/g, '<i class="fas fa-times text-danger"></i>');
  formatted = formatted.replace(/[✅]/g, '<i class="fas fa-check-circle text-success"></i>');
  formatted = formatted.replace(/[❌]/g, '<i class="fas fa-times-circle text-danger"></i>');
  
  return formatted;
};

// 返回
const goBack = () => {
  router.push('/teacher/homework-hub');
};

onMounted(async () => {
  await loadAssignments();
  await loadSubmissions();
});
</script>

<template>
  <div class="py-2 container-fluid">
    <div class="row mb-2">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h4 class="mb-0">批改作业</h4>
              <argon-button color="secondary" size="sm" @click="goBack">
                <i class="fas fa-arrow-left me-2"></i>返回
              </argon-button>
            </div>
            
            <!-- 搜索和筛选工具栏 -->
            <div class="row">
              <div class="col-md-3 col-sm-12 mb-3">
                <ArgonInput
                  v-model="searchQuery"
                  placeholder="搜索学生姓名或作业..."
                  icon="fas fa-search"
                  size="lg"
                />
              </div>
              <div class="col-md-3 col-sm-12 mb-3">
                <select v-model="selectedAssignment" class="form-select">
                  <option value="all">全部作业</option>
                  <option v-for="assignment in assignmentList" :key="assignment.id" :value="assignment.id">
                    {{ assignment.title }}
                  </option>
                </select>
              </div>
              <div class="col-md-3 col-sm-12 mb-3">
                <select v-model="selectedSubject" class="form-select">
                  <option value="all">全部学科</option>
                  <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
                </select>
              </div>
              <div class="col-md-3 col-sm-12 mb-3">
                <select v-model="selectedStatus" class="form-select">
                  <option value="all">全部状态</option>
                  <option v-for="status in statusList" :key="status.id" :value="status.id">
                    {{ status.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="card-body">
            <!-- 加载状态 -->
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">加载中...</span>
              </div>
              <p class="mt-2">加载数据...</p>
            </div>
            
            <!-- 提交列表 -->
            <div v-else class="table-responsive">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">学生</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">作业</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">学科</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">提交时间</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">状态</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">成绩</th>
                    <th class="text-secondary opacity-7">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="filteredSubmissions.length > 0">
                    <tr v-for="submission in filteredSubmissions" :key="submission.id">
                      <td>
                        <div class="d-flex px-2 py-1">
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">{{ submission.studentName || '未知学生' }}</h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p class="text-xs font-weight-bold mb-0">{{ submission.assignmentTitle }}</p>
                      </td>
                      <td>
                        <ArgonBadge :color="getSubjectColor(submission.subject)" size="sm">
                          {{ submission.subject }}
                        </ArgonBadge>
                      </td>
                      <td>
                        <p class="text-xs font-weight-bold mb-0">{{ formatDateTime(submission.submitTime) }}</p>
                      </td>
                      <td>
                        <ArgonBadge :color="getStatusColor(submission.status)" size="sm">
                          {{ getStatusText(submission.status) }}
                        </ArgonBadge>
                      </td>
                      <td>
                        <p class="text-xs font-weight-bold mb-0" v-if="submission.grade !== null">
                          {{ submission.grade }}分
                        </p>
                        <p class="text-xs text-secondary mb-0" v-else>未批改</p>
                      </td>
                      <td class="align-middle">
                        <div class="d-flex">
                          <ArgonButton 
                            color="info" 
                            size="sm" 
                            variant="outline" 
                            class="me-2"
                            @click="viewDetail(submission)"
                          >
                            <i class="fas fa-eye me-1"></i>查看
                          </ArgonButton>
                          <ArgonButton 
                            color="success" 
                            size="sm" 
                            variant="outline"
                            @click="openGradeDialog(submission)"
                          >
                            <i class="fas fa-edit me-1"></i>
                            {{ submission.status === 'graded' ? '重新批改' : '批改' }}
                          </ArgonButton>
                        </div>
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td colspan="7" class="text-center py-4">
                        <div class="empty-state">
                          <i class="ni ni-book-bookmark mb-2" style="font-size: 2rem;"></i>
                          <p>暂无待批改的作业</p>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 批改对话框 -->
    <div class="modal fade" :class="{ 'show d-block': showGradeDialog }" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">批改作业</h5>
            <button type="button" class="btn-close" @click="closeGradeDialog"></button>
          </div>
          <div class="modal-body" v-if="currentSubmission">
            <!-- 作业信息 -->
            <div class="card mb-3">
              <div class="card-header pb-0 pt-3">
                <h6 class="mb-0">作业信息</h6>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <p class="text-sm mb-1"><strong>作业：</strong>{{ currentSubmission.assignmentTitle }}</p>
                    <p class="text-sm mb-1"><strong>学生：</strong>{{ currentSubmission.studentName }}</p>
                  </div>
                  <div class="col-md-6">
                    <p class="text-sm mb-1"><strong>学科：</strong>{{ currentSubmission.subject }}</p>
                    <p class="text-sm mb-1"><strong>提交时间：</strong>{{ formatDateTime(currentSubmission.submitTime) }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 学生提交内容 -->
            <div class="card mb-3">
              <div class="card-header pb-0 pt-3">
                <h6 class="mb-0">提交内容</h6>
              </div>
              <div class="card-body">
                <div class="formatted-content" v-if="currentSubmission.content" v-html="formatText(currentSubmission.content)"></div>
                <p class="text-sm text-muted" v-else>学生未填写文字内容</p>
                
                <div v-if="currentSubmission.fileAddress" class="mt-2">
                  <p class="text-sm mb-1"><strong>附件：</strong></p>
                  <a :href="currentSubmission.fileAddress" target="_blank" class="btn btn-sm btn-outline-primary">
                    <i class="fas fa-download me-1"></i>下载附件
                  </a>
                </div>
              </div>
            </div>
            
            <!-- 已有评分信息 -->
            <div class="card mb-3" v-if="currentSubmission.status === 'graded'">
              <div class="card-header pb-0 pt-3 bg-light">
                <h6 class="mb-0">
                  <i class="fas fa-check-circle text-success me-2"></i>已批改
                </h6>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <strong>成绩：</strong>
                  <span class="badge bg-success ms-2" style="font-size: 1.1rem;">{{ currentSubmission.grade }}分</span>
                </div>
                <div v-if="currentSubmission.feedback">
                  <strong class="d-block mb-2">教师反馈：</strong>
                  <div class="formatted-feedback" v-html="formatText(currentSubmission.feedback)"></div>
                </div>
              </div>
            </div>
            
            <!-- 批改表单 -->
            <div class="card">
              <div class="card-header pb-0 pt-3 d-flex justify-content-between align-items-center">
                <h6 class="mb-0">批改</h6>
                <button 
                  type="button" 
                  class="btn btn-sm btn-info d-flex align-items-center"
                  @click="openAIDialog"
                >
                  <i class="fas fa-robot me-2"></i>AI初评
                </button>
              </div>
              <div class="card-body">
                <div class="form-group mb-3">
                  <label class="form-control-label">成绩 <span class="text-danger">*</span></label>
                  <input
                    v-model="gradeForm.grade"
                    type="number"
                    min="0"
                    max="100"
                    class="form-control"
                    placeholder="请输入成绩（0-100）"
                  />
                </div>
                
                <div class="form-group mb-3">
                  <label class="form-control-label">教师反馈（可选）</label>
                  <textarea
                    v-model="gradeForm.feedback"
                    class="form-control"
                    rows="4"
                    placeholder="请输入对学生作业的评价和建议..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="closeGradeDialog"
              :disabled="submitting"
            >
              取消
            </button>
            <button 
              type="button" 
              class="btn btn-success d-flex align-items-center" 
              @click="submitGrade"
              :disabled="submitting"
            >
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="fas fa-check me-2"></i>
              {{ submitting ? '提交中...' : '确认批改' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" :class="{ 'show': showGradeDialog }" v-if="showGradeDialog"></div>

    <!-- AI初评对话框 -->
    <div class="modal fade ai-evaluation-modal" :class="{ 'show d-block': showAIDialog }" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-robot me-2"></i>AI作业初评助手
            </h5>
            <button type="button" class="btn-close" @click="closeAIDialog"></button>
          </div>
          <div class="modal-body ai-modal-body">
            <div class="row h-100">
              <!-- 左侧：作业信息和复制区 -->
              <div class="col-md-5 h-100 d-flex flex-column">
                <div class="card mb-3">
                  <div class="card-header pb-2 pt-3 bg-gradient-info">
                    <h6 class="text-white mb-0">
                      <i class="fas fa-info-circle me-2"></i>作业信息
                    </h6>
                  </div>
                  <div class="card-body">
                    <p class="text-sm mb-1"><strong>学生：</strong>{{ currentSubmission?.studentName }}</p>
                    <p class="text-sm mb-1"><strong>作业：</strong>{{ currentSubmission?.assignmentTitle }}</p>
                    <p class="text-sm mb-0"><strong>学科：</strong>{{ currentSubmission?.subject }}</p>
                  </div>
                </div>
                
                <div class="card flex-grow-1 d-flex flex-column">
                  <div class="card-header pb-2 pt-3 d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">
                      <i class="fas fa-copy me-2"></i>待评估内容
                    </h6>
                    <button 
                      type="button" 
                      class="btn btn-sm btn-success"
                      @click="copyToClipboard"
                    >
                      <i class="fas fa-clipboard me-1"></i>一键复制
                    </button>
                  </div>
                  <div class="card-body flex-grow-1" style="overflow-y: auto;">
                    <div class="alert alert-info mb-3">
                      <i class="fas fa-lightbulb me-2"></i>
                      <small>点击"一键复制"按钮，然后粘贴到右侧AI聊天框中，即可获得AI初评建议</small>
                    </div>
                    <pre class="bg-light p-3 rounded" style="white-space: pre-wrap; word-wrap: break-word; font-size: 0.875rem; max-height: none;">{{ aiEvaluationText }}</pre>
                  </div>
                </div>
              </div>
              
              <!-- 右侧：Dify AI聊天框 -->
              <div class="col-md-7 h-100">
                <div class="card h-100">
                  <div class="card-header pb-2 pt-3 bg-gradient-primary">
                    <h6 class="text-white mb-0">
                      <i class="fas fa-comments me-2"></i>AI评估对话
                    </h6>
                  </div>
                  <div class="card-body p-0 h-100">
                    <iframe
                      src="http://68.183.234.61/chatbot/PkQGScWOv7BFhtE3"
                      style="width: 100%; height: 100%; border: none;"
                      allow="microphone"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="closeAIDialog"
            >
              <i class="fas fa-times me-2"></i>关闭
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade ai-modal-backdrop" :class="{ 'show': showAIDialog }" v-if="showAIDialog"></div>
  </div>
</template>

<style scoped>
.card {
  box-shadow: 0 20px 27px 0 rgb(0 0 0 / 5%);
  transition: all 0.2s ease-in-out;
}

.form-control, .form-select {
  border: 1px solid #d2d6da;
  border-radius: 0.5rem;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
}

.form-control:focus, .form-select:focus {
  border-color: #5e72e4;
  box-shadow: 0 0 0 0.2rem rgba(94, 114, 228, 0.1);
}

.table th {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1rem 0.5rem;
}

.table td {
  padding: 0.75rem 0.5rem;
  vertical-align: middle;
}

.empty-state {
  padding: 1rem;
  text-align: center;
  color: #8392ab;
}

.modal-backdrop.show {
  opacity: 0.5;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.form-control-label {
  font-weight: 600;
  font-size: 0.875rem;
  color: #344767;
  margin-bottom: 0.5rem;
}

.text-danger {
  color: #dc3545 !important;
}

.bg-gradient-info {
  background-image: linear-gradient(310deg, #2152ff 0%, #21d4fd 100%);
}

.bg-gradient-primary {
  background-image: linear-gradient(310deg, #7928ca 0%, #ff0080 100%);
}

pre {
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
}

/* AI初评对话框样式 */
.ai-evaluation-modal .modal-dialog {
  max-width: 92vw;
  width: 92vw;
  margin: 2vh auto;
  position: relative;
  z-index: 10000;
}

.ai-evaluation-modal .modal-content {
  height: 90vh;
  max-height: 90vh;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
}

.ai-evaluation-modal .ai-modal-body {
  height: calc(90vh - 130px);
  overflow-y: auto;
  padding: 1rem;
}

/* 确保对话框在导航栏之上 */
.ai-evaluation-modal {
  z-index: 9999 !important;
  padding-left: 0 !important;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

/* backdrop样式 */
.ai-modal-backdrop {
  display: none !important; /* 不需要单独的backdrop，modal本身就有背景 */
}

/* 左侧内容区域优化 */
.ai-evaluation-modal .col-md-5 {
  max-height: calc(90vh - 150px);
}

/* 右侧AI聊天区域优化 */
.ai-evaluation-modal .col-md-7 .card {
  height: calc(90vh - 150px);
}

.ai-evaluation-modal .col-md-7 .card-body {
  height: calc(100% - 50px);
}

/* 确保对话框内容可见 */
.ai-evaluation-modal .modal-header,
.ai-evaluation-modal .modal-footer {
  background-color: #fff;
  z-index: 1;
  position: relative;
}

/* 格式化内容样式 */
.formatted-content,
.formatted-feedback {
  line-height: 1.8;
  color: #344767;
}

.formatted-content h3,
.formatted-content h4,
.formatted-content h5,
.formatted-feedback h3,
.formatted-feedback h4,
.formatted-feedback h5 {
  color: #344767;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.formatted-content .list-item,
.formatted-feedback .list-item {
  margin: 0.5rem 0;
  padding-left: 0.5rem;
  display: flex;
  align-items: flex-start;
}

.formatted-content .list-number,
.formatted-feedback .list-number {
  color: #5e72e4;
  font-weight: 600;
  min-width: 2rem;
  margin-right: 0.5rem;
}

.formatted-content .list-bullet,
.formatted-feedback .list-bullet {
  color: #5e72e4;
  font-weight: 600;
  min-width: 1.5rem;
  margin-right: 0.5rem;
}

.formatted-content .score-tag,
.formatted-feedback .score-tag {
  color: #f53939;
  font-weight: 600;
  background: rgba(245, 57, 57, 0.1);
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
}

.formatted-content strong,
.formatted-feedback strong {
  color: #344767;
  font-weight: 600;
}

.formatted-content .text-primary,
.formatted-feedback .text-primary {
  color: #5e72e4 !important;
  font-weight: 600;
}

.formatted-feedback {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  border-left: 4px solid #5e72e4;
}
</style>

