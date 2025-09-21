<script setup>
import { ref, computed } from "vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonBadge from "@/components/ArgonBadge.vue";
import ArgonInput from "@/components/ArgonInput.vue";

// 搜索和筛选
const searchQuery = ref('');
const selectedType = ref('all');

// 文档资料数据
const documentMaterials = ref([
  {
    id: 1,
    title: "人教版高中语文必修一教材",
    description: "人民教育出版社出版的高中语文必修一标准教材，包含古代诗文、现代文等内容",
    url: "/teaching-plan",
    type: "PDF"
  },
  {
    id: 2,
    title: "北师大版初中数学七年级上册教科书",
    description: "北京师范大学出版社出版的七年级上册数学教材，包含数与代数、图形与几何等内容",
    url: "/teaching-plan",
    type: "PDF"
  },
  {
    id: 3,
    title: "苏教版小学科学三年级教师用书",
    description: "江苏教育出版社出版的小学科学教师用书，包含教学设计和教学资源",
    url: "/analytics",
    type: "DOC"
  },
  {
    id: 4,
    title: "高中物理实验教材（沪科版）",
    description: "上海科技出版社出版的高中物理实验专用教材，包含力学、电学等实验指导",
    url: "/teaching-assistant",
    type: "PDF"
  },
  {
    id: 5,
    title: "中考英语语法精讲教材",
    description: "针对中考英语考点的语法精讲材料，包含时态、语态、从句等重点内容",
    url: "/teaching-plan",
    type: "DOC"
  },
  {
    id: 6,
    title: "高考数学一轮复习资料",
    description: "针对高考数学科目的系统性复习资料，包含各章节知识点总结和典型例题",
    url: "/teaching-plan",
    type: "PDF"
  },
  {
    id: 7,
    title: "初中历史知识图谱",
    description: "初中历史重要事件、人物和时间线的知识图谱，帮助系统掌握历史知识脉络",
    url: "/teaching-assistant",
    type: "XLS"
  },
  {
    id: 8,
    title: "高中生物必修知识手册",
    description: "高中生物必修课程的知识点手册，包含细胞、遗传、进化等核心概念",
    url: "/teaching-plan",
    type: "DOC"
  },
  {
    id: 9,
    title: "小学语文教学设计指南",
    description: "小学语文教学设计的详细指南，包含教学目标设定、课堂活动设计和评价方法",
    url: "/teaching-plan",
    type: "DOC"
  },
  {
    id: 10,
    title: "初中英语教学大纲解读",
    description: "最新版初中英语教学大纲的详细解读和教学建议，帮助教师理解教学要求",
    url: "/analytics",
    type: "PDF"
  }
]);

// 课程资料数据
const courseMaterials = ref([
  {
    id: 1,
    title: "高中数学必修一同步课件",
    description: "与人教版高中数学必修一教材同步的PPT课件，包含函数、三角函数等章节",
    url: "/courseware-hub",
    type: "课件"
  },
  {
    id: 2,
    title: "初中语文阅读理解专项训练习题集",
    description: "针对初中语文阅读理解能力培养的专项习题，含文言文、现代文阅读题",
    url: "/courseware-hub",
    type: "习题"
  },
  {
    id: 3,
    title: "小学英语单词发音视频教程",
    description: "小学英语常用单词标准发音教学视频，配有情景对话和互动练习",
    url: "/courseware-hub",
    type: "视频"
  },
  {
    id: 4,
    title: "初中物理力学实验操作视频",
    description: "初中物理力学单元实验的标准操作演示视频，包含测量、力的合成等实验",
    url: "/courseware-hub",
    type: "视频"
  },
  {
    id: 5,
    title: "高中化学元素周期表互动课件",
    description: "高中化学元素周期表互动学习课件，包含元素性质、规律等内容",
    url: "/courseware-hub",
    type: "课件"
  },
  {
    id: 6,
    title: "中考数学几何压轴题解析",
    description: "针对中考数学几何压轴题的详细解析和解题技巧讲解",
    url: "/courseware-hub",
    type: "习题"
  },
  {
    id: 7,
    title: "高中英语听力训练音频集",
    description: "高中英语听力考试专项训练音频，包含对话、短文和答题技巧指导",
    url: "/courseware-hub",
    type: "音频"
  },
  {
    id: 8,
    title: "初中化学实验安全指南",
    description: "初中化学实验的安全操作规范和注意事项，包含常见危险品处理方法",
    url: "/courseware-hub",
    type: "实验"
  },
  {
    id: 9,
    title: "高中物理力学综合习题集",
    description: "高中物理力学部分的综合性习题集，包含各类典型题目和解题方法",
    url: "/courseware-hub",
    type: "习题"
  },
  {
    id: 10,
    title: "初中地理地图识别训练",
    description: "初中地理常见地图的识别和分析训练，包含地形图、气候图等内容",
    url: "/courseware-hub",
    type: "课件"
  }
]);

// 获取文件类型对应的颜色
const getTypeColor = (type) => {
  const typeColors = {
    "PDF": "danger",
    "DOC": "info",
    "XLS": "success",
    "视频": "primary",
    "课件": "warning",
    "音频": "info",
    "实验": "success",
    "习题": "info"
  };
  return typeColors[type] || "secondary";
};

// 获取所有可用的资料类型
const materialTypes = computed(() => {
  const types = new Set();
  documentMaterials.value.forEach(item => types.add(item.type));
  courseMaterials.value.forEach(item => types.add(item.type));
  return Array.from(types);
});

// 筛选文档资料
const filteredDocumentMaterials = computed(() => {
  return documentMaterials.value.filter(material => {
    const matchesSearch = searchQuery.value === '' || 
      material.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
      material.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesType = selectedType.value === 'all' || material.type === selectedType.value;
    return matchesSearch && matchesType;
  });
});

// 筛选课程资料
const filteredCourseMaterials = computed(() => {
  return courseMaterials.value.filter(material => {
    const matchesSearch = searchQuery.value === '' || 
      material.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
      material.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesType = selectedType.value === 'all' || material.type === selectedType.value;
    return matchesSearch && matchesType;
  });
});
</script>

<template>
  <div class="py-2 container-fluid">
    <div class="row mb-3">
      <div class="col-12 mb-2">
        <div class="card">
          <div class="card-header pb-0">
            <h4 class="mb-0">学习资料中心</h4>
          </div>
          <div class="card-body pt-3">
            <p class="text-sm mb-0">
              欢迎访问学习资料中心，这里提供了丰富的教学文档和课程资料，帮助您更好地进行教学和学习。
            </p>
            
            <!-- 搜索和筛选工具栏 -->
            <div class="row mt-3">
              <div class="col-md-5 col-sm-12 mb-0">
                <ArgonInput
                  v-model="searchQuery"
                  placeholder="搜索资料名称或描述..."
                  icon="fas fa-search"
                  size="lg"
                />
              </div>
              <div class="col-md-7 col-sm-12 mb-3">
                <div class="d-flex align-items-center">
                  <label class="me-2 text-sm text-nowrap">按类型筛选:</label>
                  <select v-model="selectedType" class="form-select">
                    <option value="all">全部类型</option>
                    <option v-for="type in materialTypes" :key="type" :value="type">{{ type }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文档资料部分 -->
    <div class="row mt-2 mb-4">
      <div class="col-12">
        <div class="card mb-3">
          <div class="card-header pb-0">
            <div class="d-flex align-items-center">
              <h4 class="mb-2">文档资料</h4>
              <span class="ms-2">
                <ArgonBadge color="primary" size="sm">{{ filteredDocumentMaterials.length }}个资源</ArgonBadge>
              </span>
            </div>
            <p class="text-sm mb-2 mt-1">
              教学相关的文档资料，包括教学指南、标准和参考资料
            </p>
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7">资料名称</th>
                    <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 ps-2">类型</th>
                    <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 ps-2">描述</th>
                    <th class="text-secondary opacity-7"></th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="filteredDocumentMaterials.length > 0">
                    <tr v-for="material in filteredDocumentMaterials" :key="material.id">
                      <td>
                        <div class="d-flex px-3 py-1">
                          <div>
                            <h6 class="mb-0 text-sm font-weight-bold">{{ material.title }}</h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <ArgonBadge :color="getTypeColor(material.type)" size="sm">{{ material.type }}</ArgonBadge>
                      </td>
                      <td>
                        <p class="text-sm text-secondary mb-0 font-weight-normal">{{ material.description }}</p>
                      </td>
                      <td class="align-middle">
                        <router-link :to="material.url" class="text-decoration-none">
                          <ArgonButton color="info" size="sm" variant="outline">查看资料</ArgonButton>
                        </router-link>
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td colspan="4">
                        <div class="empty-state">
                          <i class="ni ni-folder-17 mb-2" style="font-size: 2rem;"></i>
                          <p>没有找到符合条件的文档资料</p>
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

    <!-- 课程资料部分 -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card mb-3">
          <div class="card-header pb-0">
            <div class="d-flex align-items-center">
              <h4 class="mb-2">课程资料</h4>
              <span class="ms-2">
                <ArgonBadge color="warning" size="sm">{{ filteredCourseMaterials.length }}个资源</ArgonBadge>
              </span>
            </div>
            <p class="text-sm mb-2 mt-1">
              各学科课程相关的教学资料，包括视频、课件和练习材料
            </p>
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7">资料名称</th>
                    <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 ps-2">类型</th>
                    <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 ps-2">描述</th>
                    <th class="text-secondary opacity-7"></th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="filteredCourseMaterials.length > 0">
                    <tr v-for="material in filteredCourseMaterials" :key="material.id">
                      <td>
                        <div class="d-flex px-3 py-1">
                          <div>
                            <h6 class="mb-0 text-sm font-weight-bold">{{ material.title }}</h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <ArgonBadge :color="getTypeColor(material.type)" size="sm">{{ material.type }}</ArgonBadge>
                      </td>
                      <td>
                        <p class="text-sm text-secondary mb-0 font-weight-normal">{{ material.description }}</p>
                      </td>
                      <td class="align-middle">
                        <router-link :to="material.url" class="text-decoration-none">
                          <ArgonButton color="warning" size="sm" variant="outline">查看资料</ArgonButton>
                        </router-link>
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td colspan="4">
                        <div class="empty-state">
                          <i class="ni ni-books mb-2" style="font-size: 2rem;"></i>
                          <p>没有找到符合条件的课程资料</p>
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

.table td, .table th {
  white-space: nowrap;
}

.table tbody tr:last-child td {
  border-bottom: none;
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

/* 表格样式增强 */
.table {
  margin-bottom: 0;
}

.table thead th {
  padding-top: 12px;
  padding-bottom: 12px;
}

.table tbody tr {
  transition: all 0.2s ease;
}

.table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}



/* 卡片内容间距调整 */
.card-body {
  padding: 1.5rem;
}

/* PDF类型badge样式调整 - 浅红色背景配深红色文字 */
.badge-danger {
  background-color: rgba(220, 53, 69, 0.15) !important;
  color: #dc3545 !important;
}
</style>