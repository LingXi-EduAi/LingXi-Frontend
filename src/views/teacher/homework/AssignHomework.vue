<template>
  <div class="py-2 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0">
            <div class="d-flex align-items-center justify-content-between">
              <h4 class="mb-0">布置作业</h4>
              <argon-button color="secondary" size="sm" @click="goBack">
                <i class="fas fa-arrow-left me-2"></i>返回
              </argon-button>
            </div>
          </div>
          <div class="card-body">
            <form @submit.prevent="submitHomework">
              <div class="row">
                <div class="col-md-8">
                  <div class="form-group mb-3">
                    <label for="title" class="form-control-label">作业标题 <span class="text-danger">*</span></label>
                    <argon-input
                      id="title"
                      v-model="homeworkForm.title"
                      type="text"
                      placeholder="请输入作业标题"
                      size="lg"
                      :is-required="true"
                    />
                  </div>
                  
                  <div class="form-group mb-3">
                    <label for="content" class="form-control-label">作业内容 <span class="text-danger">*</span></label>
                    <textarea
                      id="content"
                      v-model="homeworkForm.content"
                      class="form-control"
                      rows="8"
                      placeholder="请输入作业内容和要求..."
                    ></textarea>
                  </div>
                  
                  <div class="form-group mb-3">
                    <label class="form-control-label">附件上传（可选）</label>
                    <div class="file-upload-container">
                      <div 
                        class="file-upload-box p-3 border rounded text-center"
                        @click="triggerFileUpload"
                        @dragover="handleDragOver"
                        @dragleave="handleDragLeave"
                        @drop="handleDrop"
                      >
                        <input 
                          type="file" 
                          class="file-input d-none" 
                          ref="fileInput"
                          @change="handleFileUpload"
                        >
                        <i class="fas fa-cloud-upload-alt mb-2" style="font-size: 2rem; color: #5e72e4;"></i>
                        <p class="mb-1">点击或拖拽文件到此处上传</p>
                        <p class="text-muted small mb-0">支持Word、PDF、图片等格式</p>
                      </div>
                    </div>
                    
                    <!-- 已上传文件显示 -->
                    <div v-if="uploadedFile" class="mt-2 p-2 border rounded d-flex align-items-center">
                      <i class="fas fa-file me-2"></i>
                      <span class="flex-grow-1">{{ uploadedFile.name }}</span>
                      <button type="button" class="btn btn-sm btn-outline-danger" @click="removeFile">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-4">
                  <div class="form-group mb-3">
                    <label for="subject" class="form-control-label">学科 <span class="text-danger">*</span></label>
                    <select 
                      id="subject"
                      v-model="homeworkForm.subject" 
                      class="form-select"
                    >
                      <option value="">请选择学科</option>
                      <option v-for="subject in subjects" :key="subject" :value="subject">
                        {{ subject }}
                      </option>
                    </select>
                  </div>
                  
                  <div class="form-group mb-3">
                    <label for="classId" class="form-control-label">班级 <span class="text-danger">*</span></label>
                    <select 
                      id="classId"
                      v-model="homeworkForm.classId" 
                      class="form-select"
                    >
                      <option value="">请选择班级</option>
                      <option v-for="cls in classList" :key="cls.id" :value="cls.id">
                        {{ cls.name }}
                      </option>
                    </select>
                  </div>
                  
                  <div class="form-group mb-3">
                    <label for="startTime" class="form-control-label">开始时间 <span class="text-danger">*</span></label>
                    <div class="datetime-input-wrapper">
                      <input
                        id="startTime"
                        v-model="homeworkForm.startTime"
                        type="datetime-local"
                        class="form-control datetime-input"
                        :class="{ 'has-value': homeworkForm.startTime }"
                      />
                      <span class="datetime-placeholder" v-if="!homeworkForm.startTime">年/月/日 时:分</span>
                    </div>
                  </div>
                  
                  <div class="form-group mb-3">
                    <label for="endTime" class="form-control-label">截止时间 <span class="text-danger">*</span></label>
                    <div class="datetime-input-wrapper">
                      <input
                        id="endTime"
                        v-model="homeworkForm.endTime"
                        type="datetime-local"
                        class="form-control datetime-input"
                        :class="{ 'has-value': homeworkForm.endTime }"
                      />
                      <span class="datetime-placeholder" v-if="!homeworkForm.endTime">年/月/日 时:分</span>
                    </div>
                  </div>
                  
                  <div class="form-group mb-3">
                    <label for="status" class="form-control-label">作业状态 <span class="text-danger">*</span></label>
                    <select 
                      id="status"
                      v-model="homeworkForm.status" 
                      class="form-select"
                    >
                      <option value="pending">未开始</option>
                      <option value="progress">进行中</option>
                      <option value="ended">已结束</option>
                    </select>
                  </div>
                  
                  <div class="alert alert-info" role="alert">
                    <i class="fas fa-info-circle me-2"></i>
                    <small>
                      <strong>状态说明：</strong><br>
                      • 未开始：作业已布置，学生可见但提示未开始<br>
                      • 进行中：学生可以正常提交作业<br>
                      • 已结束：学生不能再提交，仅可查看
                    </small>
                  </div>
                </div>
              </div>
              
              <div class="row mt-3">
                <div class="col-12 text-end">
                  <argon-button 
                    color="secondary" 
                    variant="outline"
                    type="button"
                    class="me-2"
                    @click="goBack"
                  >
                    取消
                  </argon-button>
                  <argon-button 
                    color="success" 
                    type="submit"
                    :disabled="submitting"
                  >
                    <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="fas fa-check me-2"></i>
                    {{ submitting ? '提交中...' : '布置作业' }}
                  </argon-button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ArgonButton from '@/components/ArgonButton.vue';
import ArgonInput from '@/components/ArgonInput.vue';
import { baseRequest } from '@/utils/api';

const router = useRouter();

// 表单数据
const homeworkForm = ref({
  title: '',
  content: '',
  subject: '',
  classId: '',
  startTime: '',
  endTime: '',
  status: 'pending',
  fileAddress: ''
});

// 学科列表
const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治', '其他'];

// 班级列表
const classList = ref([]);

// 文件上传相关
const fileInput = ref(null);
const uploadedFile = ref(null);
const submitting = ref(false);

// 触发文件选择
const triggerFileUpload = () => {
  fileInput.value.click();
};

// 处理文件上传
const handleFileUpload = (event) => {
  const files = event.target.files || event.dataTransfer.files;
  if (!files || files.length === 0) return;
  
  const file = files[0];
  
  // 检查文件大小
  if (file.size > 10 * 1024 * 1024) {
    alert('文件大小不能超过10MB');
    return;
  }
  
  uploadedFile.value = file;
  
  // 这里应该上传文件到服务器并获取URL
  // 暂时先模拟一个文件地址
  homeworkForm.value.fileAddress = `/uploads/${file.name}`;
};

// 处理拖拽
const handleDragOver = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.currentTarget.classList.add('drag-over');
};

const handleDragLeave = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.currentTarget.classList.remove('drag-over');
};

const handleDrop = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.currentTarget.classList.remove('drag-over');
  handleFileUpload(event);
};

// 移除文件
const removeFile = () => {
  uploadedFile.value = null;
  homeworkForm.value.fileAddress = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// 获取班级列表
const loadClassList = async () => {
  try {
    // 这里应该调用实际的API获取班级列表
    // 暂时使用模拟数据
    classList.value = [
      // 小学班级
      { id: 'primary_1_1', name: '小学一年级一班' },
      { id: 'primary_1_2', name: '小学一年级二班' },
      { id: 'primary_2_1', name: '小学二年级一班' },
      { id: 'primary_2_2', name: '小学二年级二班' },
      { id: 'primary_3_1', name: '小学三年级一班' },
      { id: 'primary_3_2', name: '小学三年级二班' },
      { id: 'primary_4_1', name: '小学四年级一班' },
      { id: 'primary_4_2', name: '小学四年级二班' },
      { id: 'primary_5_1', name: '小学五年级一班' },
      { id: 'primary_5_2', name: '小学五年级二班' },
      { id: 'primary_6_1', name: '小学六年级一班' },
      { id: 'primary_6_2', name: '小学六年级二班' },
      // 初中班级
      { id: 'junior_1_1', name: '初一一班' },
      { id: 'junior_1_2', name: '初一二班' },
      { id: 'junior_2_1', name: '初二一班' },
      { id: 'junior_2_2', name: '初二二班' },
      { id: 'junior_3_1', name: '初三一班' },
      { id: 'junior_3_2', name: '初三二班' },
      // 高中班级
      { id: 'senior_1_1', name: '高一一班' },
      { id: 'senior_1_2', name: '高一二班' },
      { id: 'senior_2_1', name: '高二一班' },
      { id: 'senior_2_2', name: '高二二班' },
      { id: 'senior_3_1', name: '高三一班' },
      { id: 'senior_3_2', name: '高三二班' }
    ];
  } catch (error) {
    console.error('加载班级列表失败:', error);
  }
};

// 验证表单
const validateForm = () => {
  if (!homeworkForm.value.title) {
    alert('请输入作业标题');
    return false;
  }
  if (!homeworkForm.value.content) {
    alert('请输入作业内容');
    return false;
  }
  if (!homeworkForm.value.subject) {
    alert('请选择学科');
    return false;
  }
  if (!homeworkForm.value.classId) {
    alert('请选择班级');
    return false;
  }
  if (!homeworkForm.value.startTime) {
    alert('请选择开始时间');
    return false;
  }
  if (!homeworkForm.value.endTime) {
    alert('请选择截止时间');
    return false;
  }
  
  // 验证时间
  const startTime = new Date(homeworkForm.value.startTime);
  const endTime = new Date(homeworkForm.value.endTime);
  if (endTime <= startTime) {
    alert('截止时间必须晚于开始时间');
    return false;
  }
  
  return true;
};

// 提交作业
const submitHomework = async () => {
  if (!validateForm()) return;
  
  submitting.value = true;
  
  try {
    const response = await baseRequest.post('/homework/assignment/add', homeworkForm.value);
    
    if (response.status === 200) {
      alert('作业布置成功！');
      router.push('/teacher/homework-hub');
    } else {
      alert(response.msg || '布置作业失败');
    }
  } catch (error) {
    console.error('提交作业失败:', error);
    alert('提交失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
};

// 返回
const goBack = () => {
  router.push('/teacher/homework-hub');
};

onMounted(() => {
  loadClassList();
});
</script>

<style scoped>
.card {
  box-shadow: 0 20px 27px 0 rgb(0 0 0 / 5%);
}

.form-control-label {
  font-weight: 600;
  font-size: 0.875rem;
  color: #344767;
  margin-bottom: 0.5rem;
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

textarea.form-control {
  resize: vertical;
  min-height: 120px;
}

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

.text-danger {
  color: #dc3545 !important;
}

.alert {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
}

/* 自定义日期时间输入框样式 */
.datetime-input-wrapper {
  position: relative;
}

.datetime-input {
  position: relative;
  z-index: 2;
  background: transparent;
}

/* 未选择时隐藏默认的占位符 */
.datetime-input:not(.has-value)::-webkit-datetime-edit {
  color: transparent;
}

.datetime-input:not(.has-value)::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 0.75rem;
  z-index: 3;
}

/* 自定义中文占位符 */
.datetime-placeholder {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  pointer-events: none;
  font-size: 0.875rem;
  z-index: 1;
}

/* 有值时显示实际内容 */
.datetime-input.has-value::-webkit-datetime-edit {
  color: #495057;
}
</style>

