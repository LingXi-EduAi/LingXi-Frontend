<script setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import { ref, onMounted } from "vue";
import { request } from "@/utils/request";
import { useRouter } from "vue-router";

const router = useRouter();
const errorMessage = ref("");

// 获取班级列表
const fetchClasses = async () => {
  try {
    const response = await request.post("/LXClass/list", {});
    classes.value = response.data.list || [];
  } catch (error) {
    errorMessage.value = error.message;
  }
};

// 获取用户信息
const getUserInfo = () => {
  const userInfoStr = localStorage.getItem("userInfo");
  if (userInfoStr) {
    try {
      return JSON.parse(userInfoStr);
    } catch (error) {
      console.error("解析用户信息失败:", error);
      return null;
    }
  }
  return null;
};

// 提交表单（编辑）
const submitForm = async () => {
  try {
    const userInfo = getUserInfo();
    // 确保从用户信息中获取 id 字段作为 teacherId
    if (userInfo && userInfo.id) {
      formData.value.teacherId = userInfo.id;
    }

    console.log("提交的表单数据:", formData.value);

    const response = await request.post("/LXClass/edit", formData.value);

    if (response.status === 200) {
      showModal.value = false;
      await fetchClasses();
    }
  } catch (error) {
    errorMessage.value = error.message;
    console.error("提交表单出错:", error);
  }
};

// 班级列表
const classes = ref([]);
// 当前选中的班级详情
const currentClass = ref(null);
// 编辑表单数据
const formData = ref({
  id: "",
  name: "",
  information: "",
  notice: "",
  classGroupingId: "",
  teacherId: "",
  state: "1",
  version: 1
});
// 控制模态框显示
const showModal = ref(false);

// 跳转到添加/加入班级页面
const goToClassAdding = () => {
  router.push('/class-adding');
};

// 跳转到分班模板管理页面
const goToClassGrouping = () => {
  router.push('/class-grouping-management');
};

// 获取班级详情
const fetchClassDetail = async (id) => {
  try {
    const response = await request.post("/LXClass/detail", { id });
    console.log("班级详情响应:", response); // 添加日志查看响应数据结构

    if (response.status === 200) {
      let classDetail;

      // 处理可能的不同数据结构
      if (response.data.list && response.data.list.length > 0) {
        classDetail = response.data.list[0];
      } else if (response.data) {
        classDetail = response.data;
      }

      if (classDetail) {
        currentClass.value = classDetail;
        formData.value = {
          id: classDetail.id,
          name: classDetail.name,
          information: classDetail.information || "",
          notice: classDetail.notice || "",
          classGroupingId: classDetail.classGroupingId || "",
          teacherId: classDetail.teacherId || "",
          state: classDetail.state || "1",
          version: classDetail.version || 1
        };
        showModal.value = true;
      } else {
        errorMessage.value = "获取班级详情失败: 未找到班级数据";
        console.error("班级详情数据结构异常:", response.data);
      }
    } else {
      errorMessage.value = "获取班级详情失败: " + (response.msg || "未知错误");
    }
  } catch (error) {
    errorMessage.value = "获取班级详情出错: " + (error.message || "未知错误");
    console.error("获取班级详情异常:", error);
  }
};

// 编辑班级
const editClass = (classItem) => {
  fetchClassDetail(classItem.id);
};

// 初始化加载数据
onMounted(() => {
  fetchClasses();
});
</script>

<template>
  <div class="py-2 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card title="我的班级" :value="classes.length.toString()" description="当前加入的班级总数" :icon="{
              component: 'ni ni-books',
              background: 'bg-gradient-primary',
              shape: 'rounded-circle',
            }" />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card title="活跃班级" :value="classes.filter(c => c.state === '1').length.toString()"
              description="当前活跃的班级数量" :icon="{
                component: 'ni ni-check-bold',
                background: 'bg-gradient-warning',
                shape: 'rounded-circle',
              }" />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card title="添加/加入班级" value="点击进入" description="创建新班级或加入已有班级" :icon="{
              component: 'ni ni-fat-add',
              background: 'bg-gradient-success',
              shape: 'rounded-circle',
            }" @click="goToClassAdding" class="cursor-pointer" />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card title="分组模板管理" value="点击进入" description="管理分组模板" :icon="{
              component: 'ni ni-settings',
              background: 'bg-gradient-info',
              shape: 'rounded-circle',
            }" @click="goToClassGrouping" class="cursor-pointer" />
          </div>
        </div>

        <!-- 班级列表 -->
        <div class="row mt-4">
          <div class="col-lg-12 mb-lg-0 mb-4">
            <div class="card">
              <div class="p-3 pb-0 card-header">
                <div class="d-flex justify-content-between">
                  <h4 class="mb-2">我的班级列表</h4>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table align-items-center table-hover">
                  <thead class="thead-light">
                    <tr>
                      <th class="text-center">班级名称</th>
                      <th class="text-center">班级ID</th>
                      <th class="text-center">状态</th>
                      <th class="text-center">版本</th>
                      <th class="text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="classItem in classes" :key="classItem.id">
                      <td class="text-center align-middle">{{ classItem.name }}</td>
                      <td class="text-center align-middle">{{ classItem.id }}</td>
                      <td class="text-center align-middle">
                        <span :class="`badge badge-${classItem.state === '1' ? 'success' : 'danger'}`">
                          {{ classItem.state === '1' ? '活跃' : '停用' }}
                        </span>
                      </td>
                      <td class="text-center align-middle">{{ classItem.version || 1 }}</td>
                      <td class="text-center align-middle">
                        <div class="d-flex align-items-center justify-content-center" style="padding-top: 15px;">
                          <button class="btn btn-sm btn-info" @click="editClass(classItem)">
                            编辑
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="classes.length === 0">
                      <td colspan="5" class="text-center py-4">暂无班级数据，请先添加或加入班级</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑模态框 -->
    <div class="modal fade" :class="{ show: showModal, 'd-block': showModal }" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">编辑班级信息</h5>
            <button type="button" class="close" @click="showModal = false">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label>班级名称</label>
                <input v-model="formData.name" type="text" class="form-control" placeholder="请输入班级名称">
              </div>
              <div class="form-group">
                <label>班级信息</label>
                <textarea v-model="formData.information" class="form-control" rows="3" placeholder="请输入班级信息"></textarea>
              </div>
              <div class="form-group">
                <label>班级公告</label>
                <textarea v-model="formData.notice" class="form-control" rows="3" placeholder="请输入班级公告"></textarea>
              </div>
              <div class="form-group">
                <label>分班模板ID</label>
                <input v-model="formData.classGroupingId" type="text" class="form-control" placeholder="请输入分班模板ID">
              </div>
              <div class="form-group">
                <label>状态</label>
                <select v-model="formData.state" class="form-control">
                  <option value="1">活跃</option>
                  <option value="0">停用</option>
                </select>
              </div>
              <div class="form-group">
                <label>版本号</label>
                <input v-model.number="formData.version" type="number" class="form-control" disabled>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showModal = false">
              取消
            </button>
            <button type="button" class="btn btn-primary" @click="submitForm">
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

.table th,
.table td {
  vertical-align: middle !important;
}

.table thead th {
  font-weight: 600;
  background-color: #f8f9fa;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.cursor-pointer {
  cursor: pointer;
}
</style>