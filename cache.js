/**
 * CACHE.JS - Sistema de caché y optimización de velocidad
 * Mejora el rendimiento del sistema
 */

const Cache = {
  // ============================================
  // CACHÉ EN MEMORIA
  // ============================================

  store: {},
  ttl: {}, // Time-to-live para cada clave

  /**
   * Guardar en caché
   */
  set(key, value, minutesToLive = 10) {
    this.store[key] = value;
    
    // Configurar expiración
    if (minutesToLive > 0) {
      this.ttl[key] = Date.now() + (minutesToLive * 60 * 1000);
    }

    console.log(`💡 Cache set: ${key}`);
    return value;
  },

  /**
   * Obtener del caché
   */
  get(key) {
    // Verificar si está expirado
    if (this.ttl[key] && Date.now() > this.ttl[key]) {
      this.invalidate(key);
      return null;
    }

    if (this.store[key]) {
      console.log(`🔍 Cache hit: ${key}`);
      return this.store[key];
    }

    console.log(`👫 Cache miss: ${key}`);
    return null;
  },

  /**
   * Invalidar caché
   */
  invalidate(key) {
    delete this.store[key];
    delete this.ttl[key];
    console.log(`🗑 Cache invalidated: ${key}`);
  },

  /**
   * Limpiar todo el caché
   */
  clear() {
    this.store = {};
    this.ttl = {};
    console.log('🗑 Cache cleared');
  },

  /**
   * Obtener estadísticas del caché
   */
  getStats() {
    return {
      items: Object.keys(this.store).length,
      keys: Object.keys(this.store),
      memoryUsage: JSON.stringify(this.store).length + ' bytes'
    };
  },

  // ============================================
  // LAZY LOADING
  // ============================================

  /**
   * Cargar módulos de forma asíncrona
   */
  async loadModule(modulePath) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = modulePath;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`No se pudo cargar: ${modulePath}`));
      document.head.appendChild(script);
    });
  },

  /**
   * Cargar CSS de forma asíncrona
   */
  async loadCSS(cssPath) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssPath;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`No se pudo cargar: ${cssPath}`));
      document.head.appendChild(link);
    });
  },

  // ============================================
  // THROTTLE Y DEBOUNCE
  // ============================================

  /**
   * Throttle - Ejecutar máximo una vez cada N ms
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Debounce - Ejecutar después de N ms sin llamadas
   */
  debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  // ============================================
  // BATCH PROCESSING
  // ============================================

  /**
   * Procesar arrays grandes en lotes
   */
  processBatch(items, batchSize, processor) {
    return new Promise((resolve, reject) => {
      let index = 0;
      const results = [];

      const processBatch = () => {
        const batch = items.slice(index, index + batchSize);
        if (batch.length === 0) {
          resolve(results);
          return;
        }

        batch.forEach(item => {
          results.push(processor(item));
        });

        index += batchSize;
        // Usar requestIdleCallback o setTimeout para no bloquear UI
        if (typeof requestIdleCallback !== 'undefined') {
          requestIdleCallback(processBatch);
        } else {
          setTimeout(processBatch, 0);
        }
      };

      processBatch();
    });
  },

  // ============================================
  // MEDICIÓN DE RENDIMIENTO
  // ============================================

  /**
   * Medir tiempo de ejecución
   */
  measurePerformance(label, func) {
    const start = performance.now();
    const result = func();
    const end = performance.now();
    const duration = (end - start).toFixed(2);

    console.log(`⏱️ ${label}: ${duration}ms`);
    return { result, duration: parseFloat(duration) };
  },

  /**
   * Obtener métricas de rendimiento del navegador
   */
  getPerformanceMetrics() {
    if (!window.performance || !window.performance.timing) {
      return null;
    }

    const timing = performance.timing;
    const metrics = {
      // Tiempo de navegación
      navigationStart: timing.navigationStart,
      
      // Tiempo hasta conectar
      connectTime: timing.responseEnd - timing.fetchStart,
      
      // Tiempo de request
      requestTime: timing.responseEnd - timing.requestStart,
      
      // Tiempo de renderizado
      renderTime: timing.domComplete - timing.domLoading,
      
      // Tiempo total
      totalLoadTime: timing.loadEventEnd - timing.navigationStart,
      
      // DOM interactivo
      timeToInteractive: timing.domInteractive - timing.navigationStart
    };

    return metrics;
  },

  /**
   * Monitorear Core Web Vitals
   */
  monitorCoreWebVitals() {
    const vitals = {
      LCP: null, // Largest Contentful Paint
      FID: null, // First Input Delay
      CLS: null  // Cumulative Layout Shift
    };

    // LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.LCP = lastEntry.renderTime || lastEntry.loadTime;
        console.log(`🏙 LCP: ${vitals.LCP}ms`);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    return vitals;
  },

  // ============================================
  // OPTIMIZACIÓN DE ALMACENAMIENTO
  // ============================================

  /**
   * Comprimir JSON
   */
  compressJSON(obj) {
    return JSON.stringify(obj).length + ' bytes';
  },

  /**
   * Limpiar localStorage de datos antiguos
   */
  cleanupOldData(maxAgeMs = 7 * 24 * 60 * 60 * 1000) { // 7 días
    const keys = Object.keys(localStorage);
    const now = Date.now();

    keys.forEach(key => {
      try {
        const item = JSON.parse(localStorage.getItem(key));
        if (item.createdAt && (now - new Date(item.createdAt)) > maxAgeMs) {
          localStorage.removeItem(key);
          console.log(`🗑 Eliminado: ${key}`);
        }
      } catch (e) {
        // No es JSON, ignorar
      }
    });
  }
};

// Monitoreo automático
document.addEventListener('DOMContentLoaded', () => {
  console.log('📊 Performance Metrics:', Cache.getPerformanceMetrics());
  console.log('💎 Core Web Vitals:', Cache.monitorCoreWebVitals());
  
  // Limpiar datos antiguos cada hora
  setInterval(() => Cache.cleanupOldData(), 60 * 60 * 1000);
});
