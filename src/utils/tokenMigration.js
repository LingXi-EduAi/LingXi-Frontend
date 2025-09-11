/**
 * Token迁移工具
 * 将旧的authToken迁移到新的token格式
 */

/**
 * 迁移旧的authToken到新的token格式
 */
export function migrateToken() {
  // 检查localStorage中的authToken
  const localAuthToken = localStorage.getItem('authToken');
  if (localAuthToken && !localStorage.getItem('token')) {
    localStorage.setItem('token', localAuthToken);
    localStorage.removeItem('authToken');
    console.log('已迁移localStorage中的authToken到token');
  }

  // 检查sessionStorage中的authToken
  const sessionAuthToken = sessionStorage.getItem('authToken');
  if (sessionAuthToken && !sessionStorage.getItem('token')) {
    sessionStorage.setItem('token', sessionAuthToken);
    sessionStorage.removeItem('authToken');
    console.log('已迁移sessionStorage中的authToken到token');
  }
}

/**
 * 检查是否需要迁移
 */
export function needsMigration() {
  return !!(localStorage.getItem('authToken') || sessionStorage.getItem('authToken'));
}

/**
 * 自动迁移（在应用启动时调用）
 */
export function autoMigrate() {
  if (needsMigration()) {
    migrateToken();
  }
}
