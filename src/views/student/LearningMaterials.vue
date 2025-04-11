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
    url: "/student/teaching-assistant",
    type: "PDF"
  },
  {
    id: 2,
    title: "北师大版初中数学七年级上册教科书",
    description: "北京师范大学出版社出版的七年级上册数学教材，包含数与代数、图形与几何等内容",
    url: "/student/teaching-assistant",
    type: "PDF"
  },
  {
    id: 3,
    title: "苏教版小学科学三年级教材",
    description: "江苏教育出版社出版的小学科学教材，包含丰富的科学知识和实验活动",
    url: "/student/teaching-assistant",
    type: "DOC"
  },
  {
    id: 4,
    title: "高中物理实验教材（沪科版）",
    description: "上海科技出版社出版的高中物理实验专用教材，包含力学、电学等实验指导",
    url: "/student/teaching-assistant",
    type: "PDF"
  },
  {
    id: 5,
    title: "中考英语语法精讲教材",
    description: "针对中考英语考点的语法精讲材料，包含时态、语态、从句等重点内容",
    url: "/student/teaching-assistant",
    type: "DOC"
  },
  {
    id: 6,
    title: "高考数学一轮复习资料",
    description: "针对高考数学科目的系统性复习资料，包含各章节知识点总结和典型例题",
    url: "/student/teaching-assistant",
    type: "PDF"
  },
  {
    id: 7,
    title: "初中历史知识图谱",
    description: "初中历史重要事件、人物和时间线的知识图谱，帮助系统掌握历史知识脉络",
    url: "/student/teaching-assistant",
    type: "XLS"
  },
  {
    id: 8,
    title: "高中生物必修知识手册",
    description: "高中生物必修课程的知识点手册，包含细胞、遗传、进化等核心概念",
    url: "/student/teaching-assistant",
    type: "DOC"
  },
  {
    id: 9,
    title: "小学语文教学设计指南",
    description: "小学语文教学设计的详细指南，包含教学目标设定、课堂活动设计和评价方法",
    url: "/student/teaching-assistant",
    type: "DOC"
  },
  {
    id: 10,
    title: "初中英语教学大纲解读",
    description: "最新版初中英语教学大纲的详细解读和教学建议，帮助学生理解学习要求",
    url: "/student/teaching-assistant",
    type: "PDF"
  },
  {
    id: 11,
    title: "高中化学实验指导手册",
    description: "高中化学实验的详细操作指南，包含实验原理、步骤和注意事项",
    url: "/student/teaching-assistant",
    type: "PDF"
  },
  {
    id: 12,
    title: "初中地理世界地图集",
    description: "初中地理学习用世界地图集，包含各大洲国家分布、地形特征等内容",
    url: "/student/teaching-assistant",
    type: "PDF"
  },
  {
    id: 13,
    title: "小学数学思维训练教程",
    description: "小学数学思维能力培养专用教程，包含数学思维方法和典型例题",
    url: "/student/teaching-assistant",
    type: "DOC"
  },
  {
    id: 14,
    title: "高中政治知识框架图",
    description: "高中政治各模块知识框架图，帮助学生系统梳理政治知识体系",
    url: "/student/teaching-assistant",
    type: "XLS"
  },
  {
    id: 15,
    title: "初中语文文言文字典",
    description: "初中语文学习常用文言文字典，包含常见文言实词、虚词用法解析",
    url: "/student/teaching-assistant",
    type: "PDF"
  },
  {
    id: 16,
    title: "高考英语写作模板大全",
    description: "高考英语各类型作文模板集合，包含应用文、议论文等常见题型",
    url: "/student/teaching-assistant",
    type: "DOC"
  },
  {
    id: 17,
    title: "初中物理公式手册",
    description: "初中物理学习常用公式汇编，按章节整理，配有使用说明和例题",
    url: "/student/teaching-assistant",
    type: "PDF"
  },
  {
    id: 18,
    title: "小学英语语法图解",
    description: "小学英语基础语法图解教材，通过图示直观展示语法规则",
    url: "/student/teaching-assistant",
    type: "DOC"
  },
  {
    id: 19,
    title: "高中生物实验报告范例",
    description: "高中生物各类实验标准报告范例，包含实验目的、步骤、结果分析等",
    url: "/student/teaching-assistant",
    type: "DOC"
  },
  {
    id: 20,
    title: "中考化学方程式大全",
    description: "中考化学常考化学方程式汇编，包含物质性质、制备和实验反应",
    url: "/student/teaching-assistant",
    type: "PDF"
  },
  {
    id: 21,
    title: "高中历史时间轴",
    description: "中国古代史、近代史、世界史重要历史事件时间轴，便于记忆和复习",
    url: "/student/teaching-assistant",
    type: "XLS"
  },
  {
    id: 22,
    title: "小学科学实验记录本",
    description: "小学科学课程实验记录模板，培养学生科学实验记录和观察能力",
    url: "/student/teaching-assistant",
    type: "DOC"
  },
  {
    id: 23,
    title: "初中数学解题技巧汇编",
    description: "初中数学各类题型解题技巧和方法汇编，提高解题效率和准确率",
    url: "/student/teaching-assistant",
    type: "PDF"
  },
  {
    id: 24,
    title: "高考语文古诗文鉴赏指南",
    description: "高考语文古诗文鉴赏专项指导，包含鉴赏角度、方法和例题分析",
    url: "/student/teaching-assistant",
    type: "DOC"
  },
  {
    id: 25,
    title: "初中英语词汇表（分类版）",
    description: "初中英语学习词汇表，按主题和词性分类整理，便于系统记忆",
    url: "/student/teaching-assistant",
    type: "PDF"
  }
]);

// 课程资料数据
const courseMaterials = ref([
  {
    id: 1,
    title: "高中数学必修一同步课件",
    description: "与人教版高中数学必修一教材同步的PPT课件，包含函数、三角函数等章节",
    url: "/student/teaching-assistant",
    type: "课件"
  },
  {
    id: 2,
    title: "初中语文阅读理解专项训练习题集",
    description: "针对初中语文阅读理解能力培养的专项习题，含文言文、现代文阅读题",
    url: "/student/teaching-assistant",
    type: "习题"
  },
  {
    id: 3,
    title: "小学英语单词发音视频教程",
    description: "小学英语常用单词标准发音教学视频，配有情景对话和互动练习",
    url: "/student/teaching-assistant",
    type: "视频"
  },
  {
    id: 4,
    title: "初中物理力学实验操作视频",
    description: "初中物理力学单元实验的标准操作演示视频，包含测量、力的合成等实验",
    url: "/student/teaching-assistant",
    type: "视频"
  },
  {
    id: 5,
    title: "高中化学元素周期表互动课件",
    description: "高中化学元素周期表互动学习课件，包含元素性质、规律等内容",
    url: "/student/teaching-assistant",
    type: "课件"
  },
  {
    id: 6,
    title: "中考数学几何压轴题解析",
    description: "针对中考数学几何压轴题的详细解析和解题技巧讲解",
    url: "/student/teaching-assistant",
    type: "习题"
  },
  {
    id: 7,
    title: "高中英语听力训练音频集",
    description: "高中英语听力考试专项训练音频，包含对话、短文和答题技巧指导",
    url: "/student/teaching-assistant",
    type: "音频"
  },
  {
    id: 8,
    title: "初中化学实验安全指南",
    description: "初中化学实验的安全操作规范和注意事项，包含常见危险品处理方法",
    url: "/student/teaching-assistant",
    type: "实验"
  },
  {
    id: 9,
    title: "高中物理力学综合习题集",
    description: "高中物理力学部分的综合性习题集，包含各类典型题目和解题方法",
    url: "/student/teaching-assistant",
    type: "习题"
  },
  {
    id: 10,
    title: "初中地理地图识别训练",
    description: "初中地理常见地图的识别和分析训练，包含地形图、气候图等内容",
    url: "/student/teaching-assistant",
    type: "课件"
  },
  {
    id: 11,
    title: "小学数学思维游戏课件",
    description: "小学数学思维能力培养游戏课件，通过互动游戏提高数学思维能力",
    url: "/student/teaching-assistant",
    type: "课件"
  },
  {
    id: 12,
    title: "高中生物细胞结构3D演示视频",
    description: "高中生物细胞结构三维立体演示视频，直观展示细胞各部分结构和功能",
    url: "/student/teaching-assistant",
    type: "视频"
  },
  {
    id: 13,
    title: "初中英语语法专项练习",
    description: "初中英语语法专项练习题集，按语法点分类，包含各类题型和解析",
    url: "/student/teaching-assistant",
    type: "习题"
  },
  {
    id: 14,
    title: "高中化学实验操作视频合集",
    description: "高中化学各类实验标准操作视频合集，包含实验原理和注意事项讲解",
    url: "/student/teaching-assistant",
    type: "视频"
  },
  {
    id: 15,
    title: "小学语文朗读范例音频",
    description: "小学语文课文标准朗读音频，由专业播音员录制，帮助提高朗读水平",
    url: "/student/teaching-assistant",
    type: "音频"
  },
  {
    id: 16,
    title: "初中数学函数图像绘制课件",
    description: "初中数学函数图像绘制互动课件，帮助理解函数图像变化规律",
    url: "/student/teaching-assistant",
    type: "课件"
  },
  {
    id: 17,
    title: "高中物理电学实验指导",
    description: "高中物理电学实验详细指导材料，包含实验原理、器材使用和数据处理",
    url: "/student/teaching-assistant",
    type: "实验"
  },
  {
    id: 18,
    title: "小学英语情景对话视频",
    description: "小学英语日常情景对话视频，配有中英文字幕，帮助提高口语能力",
    url: "/student/teaching-assistant",
    type: "视频"
  },
  {
    id: 19,
    title: "中考语文作文范文赏析",
    description: "中考语文高分作文范文赏析，包含评分标准和写作技巧指导",
    url: "/student/teaching-assistant",
    type: "习题"
  },
  {
    id: 20,
    title: "高中地理地形图分析课件",
    description: "高中地理地形图分析专题课件，包含等高线判读和地形特征识别",
    url: "/student/teaching-assistant",
    type: "课件"
  },
  {
    id: 21,
    title: "初中生物显微镜使用指南",
    description: "初中生物显微镜使用详细指南，包含操作步骤和常见问题解决方法",
    url: "/student/teaching-assistant",
    type: "实验"
  },
  {
    id: 22,
    title: "高考英语听力模拟训练",
    description: "高考英语听力模拟训练音频，模拟真实考试环境和题型，提高应试能力",
    url: "/student/teaching-assistant",
    type: "音频"
  },
  {
    id: 23,
    title: "小学数学应用题专项训练",
    description: "小学数学应用题专项训练题集，按难度分级，包含解题思路和方法",
    url: "/student/teaching-assistant",
    type: "习题"
  },
  {
    id: 24,
    title: "初中历史重大事件视频讲解",
    description: "初中历史重大历史事件专题视频讲解，通过影像资料还原历史场景",
    url: "/student/teaching-assistant",
    type: "视频"
  },
  {
    id: 25,
    title: "高中政治时事分析课件",
    description: "高中政治时事热点分析课件，结合教材知识点，提高政治素养和分析能力",
    url: "/student/teaching-assistant",
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
            <h4 class="mb-0">学习资源中心</h4>
          </div>
          <div class="card-body pt-3">
            <p class="text-sm mb-0">
              欢迎访问学习资源中心，这里提供了丰富的学习资料和课程资源，帮助您更好地进行学习和复习。
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
                  <label class="me-2 text-sm">按类型筛选:</label>
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
    <div class="row mt-2 mb-3">
      <div class="col-12">
        <div class="card mb-2">
          <div class="card-header pb-0">
            <div class="d-flex align-items-center">
              <h4 class="mb-2">文档资料</h4>
              <span class="ms-2">
                <ArgonBadge color="primary" size="sm">{{ filteredDocumentMaterials.length }}个资源</ArgonBadge>
              </span>
            </div>
            <p class="text-sm mb-2 mt-1">
              学习相关的文档资料，包括教材、参考书和学习指南
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
    <div class="row mt-3">
      <div class="col-12">
        <div class="card mb-2">
          <div class="card-header pb-0">
            <div class="d-flex align-items-center">
              <h4 class="mb-2">课程资料</h4>
              <span class="ms-2">
                <ArgonBadge color="warning" size="sm">{{ filteredCourseMaterials.length }}个资源</ArgonBadge>
              </span>
            </div>
            <p class="text-sm mb-2 mt-1">
              各学科课程相关的学习资料，包括视频、课件和练习材料
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
</style>