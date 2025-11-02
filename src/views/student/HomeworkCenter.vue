<script setup>
import { ref, computed, onMounted } from "vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonBadge from "@/components/ArgonBadge.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import { baseRequest } from '@/utils/api';

// 搜索和筛选
const searchQuery = ref('');
const selectedSubject = ref('all');
const selectedStatus = ref('all');

// 作业详情对话框
const showHomeworkDetailDialog = ref(false);
const selectedHomework = ref(null);

// 提交作业对话框
const showSubmitDialog = ref(false);
const homeworkSubmission = ref({
  content: '',
  attachments: []
});

// 上传文件相关
const fileList = ref([]);
const uploading = ref(false);

// 加载状态
const loading = ref(false);

// 学科分类
const subjects = [
  '语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治', '其他'
];

// 作业状态
const homeworkStatuses = [
  { id: 'pending', label: '待提交', color: 'secondary' },
  { id: 'submitted', label: '已提交', color: 'info' },
  { id: 'graded', label: '已批改', color: 'primary' }
];

// 我的作业数据（包含作业发布和提交信息）
const myHomeworks = ref([]);

// 作业发布列表
const assignmentList = ref([]);

// 提交记录映射
const submissionMap = ref({});

// 获取状态对应的颜色
const getStatusColor = (status) => {
  const statusObj = homeworkStatuses.find(s => s.id === status);
  return statusObj ? statusObj.color : 'secondary';
};

// 获取状态对应的文本
const getStatusText = (status) => {
  const statusObj = homeworkStatuses.find(s => s.id === status);
  return statusObj ? statusObj.label : '未知状态';
};

// 获取学科对应的颜色
const getSubjectColor = (subject) => {
  const subjectColors = {
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
  return subjectColors[subject] || "secondary";
};

// 筛选作业
const filteredHomeworks = computed(() => {
  return myHomeworks.value.filter(homework => {
    const matchesSearch = searchQuery.value === '' || 
      homework.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
      homework.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesSubject = selectedSubject.value === 'all' || homework.subject === selectedSubject.value;
    const matchesStatus = selectedStatus.value === 'all' || homework.status === selectedStatus.value;
    return matchesSearch && matchesSubject && matchesStatus;
  });
});

// 打开作业详情对话框
const openHomeworkDetail = (homework) => {
  selectedHomework.value = homework;
  showHomeworkDetailDialog.value = true;
  document.body.classList.add('modal-open');
};

// 关闭作业详情对话框
const closeHomeworkDetail = () => {
  showHomeworkDetailDialog.value = false;
  document.body.classList.remove('modal-open');
};

// 打开提交作业对话框
const openSubmitDialog = (homework) => {
  selectedHomework.value = homework;
  homeworkSubmission.value = {
    content: '',
    attachments: []
  };
  fileList.value = [];
  showSubmitDialog.value = true;
  document.body.classList.add('modal-open');
  
  // 如果从详情对话框打开，则关闭详情对话框
  if (showHomeworkDetailDialog.value) {
    showHomeworkDetailDialog.value = false;
  }
};

// 关闭提交作业对话框
const closeSubmitDialog = () => {
  showSubmitDialog.value = false;
  document.body.classList.remove('modal-open');
};

// 处理文件上传
const handleFileUpload = (event) => {
  const files = event.target.files || event.dataTransfer.files;
  if (!files || files.length === 0) return;
  
  const file = files[0];
  
  // 检查文件大小
  if (file.size > 10 * 1024 * 1024) { // 10MB
    alert('文件大小不能超过10MB');
    event.target.value = '';
    return;
  }
  
  // 添加到文件列表
  fileList.value.push(file);
  
  // 清空input以便再次选择同一文件
  if (event.target.value) {
    event.target.value = '';
  }
};

// 处理拖拽上传
const handleDragOver = (event) => {
  event.preventDefault();
  event.stopPropagation();
  const uploadBox = document.querySelector('.file-upload-box');
  if (uploadBox) {
    uploadBox.classList.add('drag-over');
  }
};

const handleDragLeave = (event) => {
  event.preventDefault();
  event.stopPropagation();
  const uploadBox = document.querySelector('.file-upload-box');
  if (uploadBox) {
    uploadBox.classList.remove('drag-over');
  }
};

const handleDrop = (event) => {
  event.preventDefault();
  event.stopPropagation();
  const uploadBox = document.querySelector('.file-upload-box');
  if (uploadBox) {
    uploadBox.classList.remove('drag-over');
  }
  handleFileUpload(event);
};

// 移除已上传的文件
const removeFile = (index) => {
  fileList.value.splice(index, 1);
};

// 提交作业
const submitHomework = async () => {
  if (!homeworkSubmission.value.content && fileList.value.length === 0) {
    alert('请提供作业内容或上传附件');
    return;
  }
  
  uploading.value = true;
  
  try {
    // 处理文件上传（这里简化处理，实际应该上传到服务器）
    let fileAddress = '';
    if (fileList.value.length > 0) {
      // 实际应该调用文件上传API
      fileAddress = `/uploads/${fileList.value[0].name}`;
    }
    
    // 判断是新建还是编辑
    const isEdit = selectedHomework.value.submissionId;
    
    const submitData = {
      assignmentId: selectedHomework.value.id,
      content: homeworkSubmission.value.content,
      fileAddress: fileAddress
    };
    
    let response;
    if (isEdit) {
      // 编辑已提交的作业
      response = await baseRequest.post('/homework/submission/edit', {
        ...submitData,
        id: selectedHomework.value.submissionId,
        version: selectedHomework.value.submissionVersion
      });
    } else {
      // 新建提交
      response = await baseRequest.post('/homework/submission/add', submitData);
    }
    
    if (response.status === 200) {
      alert('作业提交成功！');
      closeSubmitDialog();
      
      // 重新加载数据
      await loadSubmissions();
      mergeHomeworkData();
    } else {
      alert(response.msg || '提交失败');
    }
  } catch (error) {
    console.error('提交作业失败:', error);
    alert('提交失败，请稍后重试');
  } finally {
    uploading.value = false;
  }
};

// 格式化日期时间，改进成实际功能
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '';
  
  try {
    const date = new Date(dateTimeStr.replace(' ', 'T'));
    
    // 如果日期无效，则直接返回原字符串
    if (isNaN(date.getTime())) {
      return dateTimeStr;
    }
    
    // 格式化为 YYYY-MM-DD HH:MM 格式
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error('日期格式化错误:', error);
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

// 检查截止日期状态，添加即将到期警告
const getDeadlineStatus = (endTime) => {
  const now = new Date();
  const deadline = new Date(endTime.replace(' ', 'T'));
  
  // 如果截止日期无效，返回空对象
  if (isNaN(deadline.getTime())) {
    return { warning: false };
  }
  
  // 计算剩余时间（毫秒）
  const timeLeft = deadline.getTime() - now.getTime();
  
  // 如果剩余时间小于24小时，返回警告状态
  if (timeLeft > 0 && timeLeft < 24 * 60 * 60 * 1000) {
    return { 
      warning: true, 
      message: '即将截止',
      hours: Math.floor(timeLeft / (60 * 60 * 1000))
    };
  }
  
  return { warning: false };
};

// 加载作业发布列表
const loadAssignments = async () => {
  try {
    const response = await baseRequest.post('/homework/assignment/list', {
      currentPage: 1,
      pageSize: 100
      // 不筛选status，加载所有作业
    });
    
    if (response.status === 200 && response.data && response.data.list) {
      // 只保留未开始和进行中的作业，过滤掉已结束的作业
      assignmentList.value = response.data.list.filter(item => 
        item.status === 'pending' || item.status === 'progress'
      );
    }
  } catch (error) {
    console.error('加载作业列表失败:', error);
  }
};

// 加载学生的提交记录
const loadSubmissions = async () => {
  try {
    const response = await baseRequest.post('/homework/submission/list', {
      currentPage: 1,
      pageSize: 100
    });
    
    if (response.status === 200 && response.data && response.data.list) {
      // 创建提交记录映射
      submissionMap.value = {};
      response.data.list.forEach(submission => {
        submissionMap.value[submission.assignmentId] = submission;
      });
    }
  } catch (error) {
    console.error('加载提交记录失败:', error);
  }
};

// 合并作业和提交数据
const mergeHomeworkData = () => {
  myHomeworks.value = assignmentList.value.map(assignment => {
    const submission = submissionMap.value[assignment.id];
    
    // 确定作业状态
    let status = 'pending'; // 待提交
    let grade = null;
    let feedback = null;
    
    if (submission) {
      status = submission.status; // submitted 或 graded
      grade = submission.grade;
      feedback = submission.feedback;
    }
    
    return {
      id: assignment.id,
      title: assignment.title,
      subject: assignment.subject || '其他',
      description: assignment.content,
      startTime: assignment.startTime,
      endTime: assignment.endTime,
      status: status,
      teacher: assignment.teacherName || '未知教师',
      grade: grade,
      feedback: feedback,
      submissionId: submission?.id,
      submissionVersion: submission?.version
    };
  });
};

// 页面加载时获取作业数据
onMounted(async () => {
  loading.value = true;
  try {
    await loadAssignments();
    await loadSubmissions();
    mergeHomeworkData();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="py-2 container-fluid">
    <div class="row mb-2">
      <div class="col-12 mb-3">
        <div class="card">
          <div class="card-header pb-0">
            <h4 class="mb-0">作业中心</h4>
          </div>
          <div class="card-body pt-3">
            <p class="text-sm mb-0">
              在这里您可以查看所有课程的作业，提交作业，并查看作业批改结果和反馈。
            </p>
            
            <!-- 搜索和筛选工具栏 -->
            <div class="row mt-3">
              <div class="col-md-4 col-sm-12 mb-0">
                <ArgonInput
                  v-model="searchQuery"
                  placeholder="搜索作业标题或描述..."
                  icon="fas fa-search"
                  size="lg"
                />
              </div>
              <div class="col-md-4 col-sm-12 mb-3">
                <div class="d-flex align-items-center filter-container">
                  <label class="me-2 text-sm filter-label">学科筛选:</label>
                  <select v-model="selectedSubject" class="form-select filter-select">
                    <option value="all">全部学科</option>
                    <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
                  </select>
                </div>
              </div>
              <div class="col-md-4 col-sm-12 mb-3">
                <div class="d-flex align-items-center filter-container">
                  <label class="me-2 text-sm filter-label">状态筛选:</label>
                  <select v-model="selectedStatus" class="form-select filter-select">
                    <option value="all">全部状态</option>
                    <option v-for="status in homeworkStatuses" :key="status.id" :value="status.id">{{ status.label }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 作业列表部分 -->
    <div class="row mt-2 mb-4">
      <div class="col-12">
        <div class="card mb-2">
          <div class="card-header pb-0">
            <div class="d-flex align-items-center">
              <h4 class="mb-0">我的作业</h4>
              <span class="ms-2">
                <ArgonBadge color="primary" size="sm">{{ filteredHomeworks.length }}个作业</ArgonBadge>
              </span>
            </div>
            <p class="text-sm mb-0 mt-1">
              您的所有课程作业都在这里，请按时完成并提交
            </p>
          </div>
          <div class="card-body">
            <!-- 加载状态 -->
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">加载中...</span>
              </div>
              <p class="mt-2">加载作业数据...</p>
            </div>
            
            <div v-else class="table-responsive">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">作业</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">学科</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">截止时间</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">状态</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">成绩</th>
                    <th class="text-secondary opacity-7">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="filteredHomeworks.length > 0">
                    <tr v-for="homework in filteredHomeworks" :key="homework.id">
                      <td>
                        <div class="d-flex px-2 py-1">
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">{{ homework.title }}</h6>
                            <p class="text-xs text-secondary mb-0">{{ homework.teacher }}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <ArgonBadge :color="getSubjectColor(homework.subject)" size="sm">{{ homework.subject }}</ArgonBadge>
                      </td>
                      <td>
                        <p class="text-xs font-weight-bold mb-0">{{ formatDateTime(homework.endTime) }}</p>
                        <p v-if="getDeadlineStatus(homework.endTime).warning" class="text-xs text-danger mb-0">
                          <i class="fas fa-exclamation-triangle me-1"></i>
                          还剩{{ getDeadlineStatus(homework.endTime).hours }}小时
                        </p>
                      </td>
                      <td>
                        <ArgonBadge :color="getStatusColor(homework.status)" size="sm">{{ getStatusText(homework.status) }}</ArgonBadge>
                      </td>
                      <td>
                        <p class="text-xs font-weight-bold mb-0" v-if="homework.grade">{{ homework.grade }}分</p>
                        <p class="text-xs text-secondary mb-0" v-else>-</p>
                      </td>
                      <td class="align-middle">
                        <div class="d-flex">
                          <ArgonButton color="info" size="sm" variant="outline" class="me-2" @click="openHomeworkDetail(homework)">
                            <i class="fas fa-eye me-1"></i>查看
                          </ArgonButton>
                          <ArgonButton 
                            v-if="homework.status === 'pending' || homework.status === 'progress'"
                            color="success" 
                            size="sm" 
                            variant="outline" 
                            @click="openSubmitDialog(homework)"
                          >
                            <i class="fas fa-paper-plane me-1"></i>提交
                          </ArgonButton>
                        </div>
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td colspan="6" class="text-center py-4">
                        <div class="empty-state">
                          <i class="ni ni-book-bookmark mb-2" style="font-size: 2rem;"></i>
                          <p>没有找到符合条件的作业</p>
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

    <!-- 作业详情对话框 -->
    <div class="modal fade" :class="{ 'show d-block': showHomeworkDetailDialog }" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" v-if="selectedHomework">{{ selectedHomework.title }}</h5>
            <button type="button" class="btn-close" @click="closeHomeworkDetail" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedHomework">
            <div class="row mb-3">
              <div class="col-md-6">
                <p class="text-sm mb-1"><strong>学科：</strong>
                  <ArgonBadge :color="getSubjectColor(selectedHomework.subject)" size="sm">{{ selectedHomework.subject }}</ArgonBadge>
                </p>
                <p class="text-sm mb-1"><strong>教师：</strong>{{ selectedHomework.teacher }}</p>
                <p class="text-sm mb-1"><strong>状态：</strong>
                  <ArgonBadge :color="getStatusColor(selectedHomework.status)" size="sm">{{ getStatusText(selectedHomework.status) }}</ArgonBadge>
                </p>
              </div>
              <div class="col-md-6">
                <p class="text-sm mb-1"><strong>开始时间：</strong>{{ formatDateTime(selectedHomework.startTime) }}</p>
                <p class="text-sm mb-1">
                  <strong>截止时间：</strong>{{ formatDateTime(selectedHomework.endTime) }}
                  <span v-if="getDeadlineStatus(selectedHomework.endTime).warning" class="text-danger ms-1">
                    <i class="fas fa-exclamation-triangle"></i>
                    还剩{{ getDeadlineStatus(selectedHomework.endTime).hours }}小时
                  </span>
                </p>
                <p class="text-sm mb-1" v-if="selectedHomework.grade"><strong>成绩：</strong>{{ selectedHomework.grade }}分</p>
              </div>
            </div>
            
            <div class="card mb-3">
              <div class="card-header pb-0 pt-3">
                <h6 class="mb-0">作业内容</h6>
              </div>
              <div class="card-body">
                <p class="text-sm">{{ selectedHomework.description }}</p>
              </div>
            </div>
            
            <div class="card mb-3" v-if="selectedHomework.status === 'graded' && selectedHomework.feedback">
              <div class="card-header pb-0 pt-3 bg-light">
                <h6 class="mb-0">
                  <i class="fas fa-comment-dots me-2 text-primary"></i>教师反馈
                </h6>
              </div>
              <div class="card-body">
                <div class="formatted-feedback" v-html="formatText(selectedHomework.feedback)"></div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeHomeworkDetail">关闭</button>
            <button 
              v-if="selectedHomework && (selectedHomework.status === 'pending' || selectedHomework.status === 'progress')"
              type="button" 
              class="btn btn-success" 
              @click="openSubmitDialog(selectedHomework)"
            >
              提交作业
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" :class="{ 'show': showHomeworkDetailDialog }" v-if="showHomeworkDetailDialog"></div>

    <!-- 提交作业对话框 -->
    <div class="modal fade" :class="{ 'show d-block': showSubmitDialog }" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">提交作业</h5>
            <button type="button" class="btn-close" @click="closeSubmitDialog" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedHomework">
            <p class="mb-3">您正在提交 <strong>{{ selectedHomework.title }}</strong> 的作业</p>
            
            <div class="form-group mb-3">
              <label for="homeworkContent" class="form-control-label">作业内容</label>
              <textarea 
                id="homeworkContent" 
                v-model="homeworkSubmission.content" 
                class="form-control" 
                rows="5" 
                placeholder="请输入您的作业内容..."
              ></textarea>
            </div>
            
            <div class="form-group mb-3">
              <label class="form-control-label">附件上传</label>
              <div class="file-upload-container mb-2">
                <div 
                  class="file-upload-box p-3 border rounded text-center position-relative"
                  @dragover="handleDragOver"
                  @dragleave="handleDragLeave"
                  @drop="handleDrop"
                >
                  <input 
                    type="file" 
                    class="file-input position-absolute" 
                    id="homeworkFile" 
                    ref="fileInput"
                    @change="handleFileUpload"
                    :disabled="uploading"
                  >
                  <div class="file-upload-content">
                    <i class="fas fa-cloud-upload-alt mb-2" style="font-size: 2rem; color: #5e72e4;"></i>
                    <p class="mb-1">点击或拖拽文件到此处上传</p>
                    <p class="text-muted small mb-0">支持Word、PDF、图片等格式文件</p>
                  </div>
                </div>
              </div>
              <small class="text-muted d-block mb-2">支持上传Word、PDF、图片等格式文件，单个文件不超过10MB</small>
              
              <!-- 已上传文件列表 -->
              <div v-if="fileList.length > 0" class="uploaded-files mt-3">
                <h6 class="text-sm mb-2"><i class="fas fa-paperclip me-1"></i> 已上传文件 ({{ fileList.length }})</h6>
                <div v-for="(file, index) in fileList" :key="index" class="uploaded-file-item d-flex align-items-center p-2 mb-2 border rounded shadow-sm">
                  <div class="file-icon me-2 d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; background-color: #e9ecef; border-radius: 4px;">
                    <i class="fas fa-file" style="color: #5e72e4;"></i>
                  </div>
                  <div class="flex-grow-1 overflow-hidden">
                    <div class="text-sm fw-bold text-truncate">{{ file.name }}</div>
                    <small class="text-muted">{{ (file.size / 1024).toFixed(1) }}KB</small>
                  </div>
                  <button 
                    type="button" 
                    class="btn btn-sm btn-outline-danger ms-2" 
                    @click="removeFile(index)"
                    :disabled="uploading"
                    title="删除文件"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="alert alert-info" role="alert">
              <i class="fas fa-info-circle me-2"></i>
              <small>
                请确保在截止时间前提交作业，截止时间：{{ formatDateTime(selectedHomework.endTime) }}
                <span v-if="getDeadlineStatus(selectedHomework.endTime).warning" class="text-danger d-block mt-1">
                  <i class="fas fa-exclamation-triangle me-1"></i>
                  距离截止时间仅剩{{ getDeadlineStatus(selectedHomework.endTime).hours }}小时
                </span>
              </small>
            </div>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="closeSubmitDialog"
              :disabled="uploading"
            >
              取消
            </button>
            <button 
              type="button" 
              class="btn btn-success d-flex align-items-center" 
              @click="submitHomework()" 
              :disabled="(homeworkSubmission.content === '' && fileList.length === 0) || uploading"
            >
              <span v-if="uploading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              <i v-else class="fas fa-paper-plane me-2"></i>
              {{ uploading ? '提交中...' : '确认提交' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" :class="{ 'show': showSubmitDialog }" v-if="showSubmitDialog"></div>
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

/* 筛选框样式 */
.filter-container {
  width: 100%;
}

.filter-label {
  white-space: nowrap;
  width: auto;
  min-width: 70px; /* 确保标签有固定的最小宽度 */
}

.filter-select {
  flex: 1;
  width: auto;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #d2d6da;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.form-select {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #d2d6da;
  font-size: 0.875rem;
  text-overflow: ellipsis;
}

/* 上传文件样式 */
.uploaded-files {
  max-height: 150px;
  overflow-y: auto;
}

.uploaded-file-item {
  background-color: #f8f9fa;
  transition: all 0.2s ease;
}

.uploaded-file-item:hover {
  background-color: #e9ecef;
}

/* 标题样式 */
h4 {
  font-weight: 600;
  color: #344767;
}

/* 空状态样式 */
.empty-state {
  padding: 1rem;
  text-align: center;
  color: #8392ab;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
  }
  
  .filter-label {
    min-width: 60px;
  }
  
  .filter-select {
    padding: 0.5rem;
  }
  
  .modal-dialog {
    margin: 0.5rem;
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


/* 表格样式 */
.table th {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1rem 0.5rem;
}

.table td {
  padding: 0.75rem 0.5rem;
  vertical-align: middle;
}

/* 文件上传样式 */
.file-upload-box {
  border: 2px dashed #d2d6da !important;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f8f9fa;
}

.file-upload-box:hover {
  border-color: #5e72e4 !important;
  background-color: #f0f2ff;
}

.file-upload-box.drag-over {
  border-color: #5e72e4 !important;
  background-color: #f0f2ff;
  transform: scale(1.02);
}

.file-input {
  opacity: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  cursor: pointer;
  z-index: 10;
}

.uploaded-file-item {
  transition: all 0.2s ease;
  background-color: #f8f9fa;
}

.uploaded-file-item:hover {
  background-color: #f0f2ff;
}

/* 格式化内容样式 */
.formatted-feedback {
  line-height: 1.8;
  color: #344767;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  border-left: 4px solid #5e72e4;
}

.formatted-feedback h3,
.formatted-feedback h4,
.formatted-feedback h5 {
  color: #344767;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.formatted-feedback .list-item {
  margin: 0.5rem 0;
  padding-left: 0.5rem;
  display: flex;
  align-items: flex-start;
}

.formatted-feedback .list-number {
  color: #5e72e4;
  font-weight: 600;
  min-width: 2rem;
  margin-right: 0.5rem;
}

.formatted-feedback .list-bullet {
  color: #5e72e4;
  font-weight: 600;
  min-width: 1.5rem;
  margin-right: 0.5rem;
}

.formatted-feedback .score-tag {
  color: #f53939;
  font-weight: 600;
  background: rgba(245, 57, 57, 0.1);
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
}

.formatted-feedback strong {
  color: #344767;
  font-weight: 600;
}

.formatted-feedback .text-primary {
  color: #5e72e4 !important;
  font-weight: 600;
}
</style>