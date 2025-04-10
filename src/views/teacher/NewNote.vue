<script setup>
import { ref, computed, onMounted } from 'vue';
import '@/styles/single-card-common.css';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-'
});

// 笔记内容
const markdownContent = ref(`# 我的笔记标题

## 小标题

这是一段普通文本，支持**粗体**、*斜体*和~~删除线~~。

### 代码示例

\`\`\`javascript
function hello() {
  console.log('Hello World!');
}
\`\`\`

### 列表示例

- 项目1
- 项目2
  - 子项目A
  - 子项目B

### 表格示例

| 姓名 | 年龄 | 成绩 |
|------|------|------|
| 张三 | 18   | 90   |
| 李四 | 19   | 85   |

`);

// 笔记标题
const noteTitle = ref('新建笔记');

// 将markdown转换为HTML
const htmlContent = computed(() => {
  return marked(markdownContent.value);
});

// 自动保存功能
const autoSave = () => {
  console.log('自动保存笔记...');
  // 这里可以实现保存到localStorage或发送到后端API
  localStorage.setItem('draft-note', markdownContent.value);
};

// 加载草稿
onMounted(() => {
  const savedDraft = localStorage.getItem('draft-note');
  if (savedDraft) {
    markdownContent.value = savedDraft;
  }
  
  // 设置自动保存
  setInterval(autoSave, 30000); // 每30秒自动保存一次
});

// 保存笔记
const saveNote = () => {
  console.log('保存笔记...');
  // 实际保存逻辑
  localStorage.setItem('saved-note-' + Date.now(), JSON.stringify({
    title: noteTitle.value,
    content: markdownContent.value,
    date: new Date().toISOString()
  }));
  alert('笔记已保存！');
};

// 清空笔记
const clearNote = () => {
  if (confirm('确定要清空当前笔记吗？')) {
    markdownContent.value = '';
    noteTitle.value = '新建笔记';
  }
};
</script>

<template>
  <div class="container-fluid">
    <div class="row mt-2">
      <div class="col-lg-12 mb-lg">
        <div class="card z-index-2">
          <div class="card-header p-3 pb-0">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <input 
                  v-model="noteTitle" 
                  class="form-control note-title-input" 
                  placeholder="笔记标题"
                />
              </div>
              <div>
                <button class="btn btn-sm btn-primary me-2" @click="saveNote">
                  <i class="ni ni-check-bold me-1"></i> 保存笔记
                </button>
                <button class="btn btn-sm btn-danger" @click="clearNote">
                  <i class="ni ni-fat-remove me-1"></i> 清空
                </button>
              </div>
            </div>
          </div>
          
          <div class="markdown-editor-container">
            <div class="editor-panel">
              <textarea 
                v-model="markdownContent"
                class="markdown-textarea"
                placeholder="在此输入Markdown内容..."
              ></textarea>
            </div>
            <div class="preview-panel">
              <div class="markdown-preview" v-html="htmlContent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.markdown-editor-container {
  display: flex;
  height: calc(100vh - 200px);
  min-height: 500px;
  border-top: 1px solid #eee;
  padding-left: 10px;
  padding-bottom: 20px;
}

.editor-panel, .preview-panel {
  flex: 1;
  position: relative; /* 添加相对定位 */
  padding: 0; /* 移除内边距 */
}

.editor-panel {
  border-right: 1px solid #eee;
}

.markdown-textarea {
  width: 100%;
  height: 100%;
  border: none;
  resize: none;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 15px; /* 将内边距移到这里 */
  outline: none;
  overflow: auto; /* 确保只有textarea有滚动条 */
  position: absolute; /* 绝对定位填满父容器 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.markdown-preview {
  height: 100%;
  overflow: auto; /* 确保只有preview有滚动条 */
  padding: 15px; /* 将内边距移到这里 */
  position: absolute; /* 绝对定位填满父容器 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.note-title-input {
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-bottom: 1px solid #eee;
  border-radius: 0;
  padding: 5px 0;
  margin-bottom: 10px;
  margin-left: 10px;
}

.note-title-input:focus {
  box-shadow: none;
  border-color: #5e72e4;
}

/* Markdown预览样式 */
.markdown-preview :deep(h1) {
  font-size: 2em;
  margin-bottom: 0.5em;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.3em;
}

.markdown-preview :deep(h2) {
  font-size: 1.5em;
  margin-top: 1em;
  margin-bottom: 0.5em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eee;
}

.markdown-preview :deep(h3) {
  font-size: 1.25em;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.markdown-preview :deep(code) {
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 85%;
  padding: 0.2em 0.4em;
}

.markdown-preview :deep(pre) {
  background-color: #f6f8fa;
  border-radius: 3px;
  padding: 16px;
  overflow: auto;
}

.markdown-preview :deep(blockquote) {
  border-left: 4px solid #dfe2e5;
  color: #6a737d;
  margin: 0;
  padding: 0 1em;
}

.markdown-preview :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 16px;
}

.markdown-preview :deep(table th),
.markdown-preview :deep(table td) {
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
}

.markdown-preview :deep(table tr:nth-child(2n)) {
  background-color: #f6f8fa;
}
</style>