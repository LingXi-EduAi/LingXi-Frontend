/**
 * 路由守卫
 * 处理路由权限验证、页面标题设置等
 */

import router from './index';

// 获取用户信息
function getUserInfo() {
  const userInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
}

// 获取Token
function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token') ||
         localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

// 检查用户是否有权限访问路由
function hasPermission(route, userInfo) {
  if (!userInfo) return false;
  
  const userRole = userInfo.state; // 1: 教师, 2: 学生
  const routePath = route.path;
  
  // 教师页面权限检查
  if (routePath.startsWith('/teacher') && userRole !== '1') {
    return false;
  }
  
  // 学生页面权限检查
  if (routePath.startsWith('/student') && userRole !== '2') {
    return false;
  }
  
  return true;
}

// 需要登录的路由
const authRequiredRoutes = [
  '/teacher',
  '/student',
  '/profile'
];

// 公开路由（不需要登录）
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/role-selection',
  '/404',
  '/403'
];

// 前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta?.title ? `${to.meta.title} - 灵犀教育` : '灵犀教育';
  
  const token = getToken();
  const userInfo = getUserInfo();
  
  // 检查是否需要登录
  const needsAuth = authRequiredRoutes.some(route => to.path.startsWith(route));
  
  if (needsAuth) {
    // 需要登录但没有token
    if (!token || !userInfo) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
      return;
    }
    
    // 有token但没有权限
    if (!hasPermission(to, userInfo)) {
      next('/403');
      return;
    }
  }
  
  // 已登录用户访问登录页面，重定向到对应首页
  if (to.path === '/login' && token && userInfo) {
    const userRole = userInfo.state;
    const redirectPath = userRole === '1' ? '/teacher/start' : '/student/start';
    next(redirectPath);
    return;
  }
  
  // 角色选择页面逻辑
  if (to.path === '/role-selection' && token && userInfo) {
    const userRole = userInfo.state;
    const redirectPath = userRole === '1' ? '/teacher/start' : '/student/start';
    next(redirectPath);
    return;
  }
  
  next();
});

// 后置守卫
router.afterEach((to, from) => {
  // 页面切换完成后的处理
  console.log(`从 ${from.path} 导航到 ${to.path}`);
  
  // 重置页面滚动位置
  window.scrollTo(0, 0);
  
  // 可以在这里添加页面访问统计
  if (process.env.NODE_ENV === 'production') {
    // 统计页面访问
    // analytics.track('page_view', { path: to.path });
  }
});

// 导航错误处理
router.onError((error) => {
  console.error('路由错误:', error);
  
  // 路由加载失败时的处理
  if (error.message.includes('Loading chunk')) {
    // 代码分割失败，通常是因为版本更新
    window.location.reload();
  }
});

export default router;
