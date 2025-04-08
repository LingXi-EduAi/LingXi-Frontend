<script setup>
import '@/styles/single-card-common.css';
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
    router.push('/');
};
</script>

<template>
    <div class="container-fluid">
        <div class="row mt-2">
            <div class="col-lg-12 mb-lg">
                <div class="card z-index-2">
                    <div class="error-content single-card-container">
                        <div class="text-center">
                            <h1 class="error-code">404</h1>
                            <h2 class="error-title mb-4">页面未找到</h2>
                            <p class="error-description mb-5">
                                抱歉，您访问的页面不存在或已被移除。
                                <br>请检查您输入的网址是否正确，或返回首页继续浏览。
                            </p>

                            <div class="d-flex justify-content-center">
                                <button class="btn bg-gradient-primary mb-0" @click="goHome">
                                    返回首页
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.error-content {
    padding: 60px 20px;
    width: 100%;
}

.error-code {
    font-size: 120px;
    font-weight: 700;
    color: #344767;
    margin-bottom: 20px;
}

.error-title {
    font-size: 32px;
    font-weight: 600;
    color: #344767;
}

.error-description {
    font-size: 18px;
    color: #67748e;
    max-width: 600px;
    margin: 0 auto;
}

.btn {
    padding: 12px 30px;
    font-weight: 600;
}
</style>