<script setup>
// 班级操作相关逻辑可以在这里添加（移除了未使用的classManagement常量）
</script>

<template>
  <div class="py-2 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row mt-4">
          <!-- 创建班级模块 -->
          <div class="col-lg-6 mb-4">
            <div class="card h-100 p-4">
              <div class="card-header p-0 bg-transparent">
                <h4 class="mb-3">创建新班级</h4>
              </div>
              <div class="card-body pt-0">
                <form>
                  <div class="mb-3">
                    <label class="form-label">班级名称</label>
                    <input type="text" class="form-control" placeholder="请输入班级名称">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">选择年级</label>
                    <select class="form-select">
                      <option>一年级</option>
                      <option>二年级</option>
                      <option>三年级</option>
                    </select>
                  </div>
                  <div class="mb-4">
                    <label class="form-label">学科类型</label>
                    <input type="text" class="form-control" placeholder="请输入教学科目">
                  </div>
                  <button class="btn bg-gradient-primary w-100" type="submit">
                    立即创建
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- 加入班级模块 -->
          <div class="col-lg-6 mb-4">
            <div class="card h-100 p-4">
              <div class="card-header p-0 bg-transparent">
                <h4 class="mb-3">加入现有班级</h4>
              </div>
              <div class="card-body pt-0">
                <form>
                  <div class="mb-4">
                    <label class="form-label">班级邀请码</label>
                    <input type="text" class="form-control" placeholder="请输入6位班级邀请码">
                  </div>
                  <button class="btn bg-gradient-success w-100" type="submit">
                    立即加入
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 0 2.5rem 0 rgba(136, 152, 170, 0.25);
}

.btn {
  font-weight: 600;
  letter-spacing: 0.025em;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
}
</style>