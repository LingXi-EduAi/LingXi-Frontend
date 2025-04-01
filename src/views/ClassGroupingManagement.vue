<script setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const errorMessage = ref("");

// 获取token并构建带token的URL
const buildUrlWithToken = (baseUrl) => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  if (!token) {
    errorMessage.value = "未登录或登录已过期";
    router.push("/login");
    return baseUrl;
  }
  return `${baseUrl}?token=${token}`;
};

// 统一错误处理 (与Login.vue保持一致)
const handleError = (error) => {
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 401:
        errorMessage.value = "身份验证失败";
        router.push("/login");
        break;
      case 403:
        errorMessage.value = "无权限访问此资源";
        break;
      default:
        errorMessage.value = error.response.data.msg || "请求失败";
    }
  } else if (error.request) {
    errorMessage.value = "无法连接到服务器";
  } else {
    errorMessage.value = "发生未知错误";
  }
  console.error("请求错误:", error);
};

// 获取分班模板列表
const fetchGroupings = async () => {
  try {
    const url = buildUrlWithToken("/classGrouping/list");
    const response = await axios.post(url, {});
    classGroupings.value = response.data.data.list || [];
  } catch (error) {
    handleError(error);
  }
};

// 获取模板详情
const fetchGroupingDetail = async (id) => {
  try {
    const url = buildUrlWithToken("/classGrouping/detail");
    const response = await axios.post(url, { id });
    currentGrouping.value = response.data.data;
    formData.value = { ...response.data.data };
    isEditMode.value = true;
    showModal.value = true;
  } catch (error) {
    handleError(error);
  }
};

// 提交表单（新增/编辑）
const submitForm = async () => {
  try {
    const url = buildUrlWithToken(
      isEditMode.value ? "/classGrouping/edit" : "/classGrouping/add"
    );
    const response = await axios.post(url, formData.value);
    
    if (response.data.status === 200) {
      showModal.value = false;
      await fetchGroupings();
    }
  } catch (error) {
    handleError(error);
  }
};

// 分班模板列表
const classGroupings = ref([]);
// 当前选中的模板详情
const currentGrouping = ref(null);
// 新增/编辑表单数据
const formData = ref({
  id: "",
  name: "",
  classRule: "",
  classCondition: "",
  volume: 10,
  state: "1",
  version: 1
});
// 控制模态框显示
const showModal = ref(false);
const isEditMode = ref(false);

// 初始化加载数据
onMounted(() => {
  fetchGroupings();
});
</script>

<template>
  <div class="py-2 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="分班模板总数"
              :value="classGroupings.length.toString()"
              description="当前系统分班模板数量"
              :icon="{
                component: 'ni ni-books',
                background: 'bg-gradient-primary',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="活跃模板"
              :value="classGroupings.filter(g => g.state === '1').length.toString()"
              description="当前可用的分班模板"
              :icon="{
                component: 'ni ni-check-bold',
                background: 'bg-gradient-success',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="最大班级容量"
              :value="Math.max(...classGroupings.map(g => g.volume), 0).toString()"
              description="单个模板最大班级容量"
              :icon="{
                component: 'ni ni-single-02',
                background: 'bg-gradient-info',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="最新版本"
              :value="Math.max(...classGroupings.map(g => g.version), 0).toString()"
              description="分班模板最高版本号"
              :icon="{
                component: 'ni ni-tag',
                background: 'bg-gradient-warning',
                shape: 'rounded-circle',
              }"
              @click="showModal = true; isEditMode = false; formData = {
                id: '',
                name: '',
                classRule: '',
                classCondition: '',
                volume: 10,
                state: '1',
                version: 1
              }"
            />
          </div>
        </div>

        <!-- 分班模板列表 -->
        <div class="row mt-4">
          <div class="col-lg-12 mb-lg-0 mb-4">
            <div class="card">
              <div class="p-3 pb-0 card-header">
                <div class="d-flex justify-content-between">
                  <h4 class="mb-2">分班模板列表</h4>
                  <button 
                    class="btn btn-sm btn-primary"
                    @click="showModal = true; isEditMode = false; formData = {
                      id: '',
                      name: '',
                      classRule: '',
                      classCondition: '',
                      volume: 10,
                      state: '1',
                      version: 1
                    }"
                  >
                    新增模板
                  </button>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table align-items-center table-hover">
                  <thead class="thead-light">
                    <tr>
                      <th class="text-center">模板名称</th>
                      <th class="text-center">班级容量</th>
                      <th class="text-center">状态</th>
                      <th class="text-center">版本</th>
                      <th class="text-center">创建时间</th>
                      <th class="text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="grouping in classGroupings" :key="grouping.id">
                      <td class="text-center align-middle">{{ grouping.name }}</td>
                      <td class="text-center align-middle">{{ grouping.volume }}</td>
                      <td class="text-center align-middle">
                        <span :class="`badge badge-${grouping.state === '1' ? 'success' : 'danger'}`">
                          {{ grouping.state === '1' ? '活跃' : '停用' }}
                        </span>
                      </td>
                      <td class="text-center align-middle">{{ grouping.version }}</td>
                      <td class="text-center align-middle">{{ grouping.createTime || '暂无' }}</td>
                      <td class="text-center align-middle">
                        <div class="d-flex align-items-center justify-content-center" style="padding-top: 15px;">
                          <button 
                            class="btn btn-sm btn-info"
                            @click="fetchGroupingDetail(grouping.id)"
                          >
                            编辑
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/编辑模态框 -->
    <div 
      class="modal fade"
      :class="{ show: showModal, 'd-block': showModal }"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditMode ? '编辑分班模板' : '新增分班模板' }}
            </h5>
            <button 
              type="button" 
              class="close"
              @click="showModal = false"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label>模板名称</label>
                <input 
                  v-model="formData.name"
                  type="text" 
                  class="form-control"
                  placeholder="请输入模板名称"
                >
              </div>
              <div class="form-group">
                <label>分班规则</label>
                <textarea
                  v-model="formData.classRule"
                  class="form-control"
                  rows="3"
                  placeholder="请输入分班规则"
                ></textarea>
              </div>
              <div class="form-group">
                <label>分班条件</label>
                <input 
                  v-model="formData.classCondition"
                  type="text" 
                  class="form-control"
                  placeholder="请输入分班条件"
                >
              </div>
              <div class="form-group">
                <label>班级容量</label>
                <input 
                  v-model.number="formData.volume"
                  type="number" 
                  class="form-control"
                  placeholder="请输入班级容量"
                >
              </div>
              <div class="form-group">
                <label>状态</label>
                <select v-model="formData.state" class="form-control">
                  <option value="1">活跃</option>
                  <option value="0">停用</option>
                </select>
              </div>
              <div v-if="isEditMode" class="form-group">
                <label>版本号</label>
                <input 
                  v-model.number="formData.version"
                  type="number" 
                  class="form-control"
                  disabled
                >
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary"
              @click="showModal = false"
            >
              取消
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              @click="submitForm"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-backdrop {
  opacity: 0.5;
}
.table th, .table td {
  vertical-align: middle !important;
}
.table thead th {
  font-weight: 600;
  background-color: #f8f9fa;
}
.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>