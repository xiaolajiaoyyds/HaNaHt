class ErrorHandler {
  static init() {
    window.addEventListener('error', this.handleError.bind(this));
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    this.createToastContainer();
  }

  static createToastContainer() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 w-full max-w-xs pointer-events-none';
      document.body.appendChild(container);
    }
  }

  static handleError(event) {
    const errorInfo = {
      type: 'javascript_error',
      message: event.message || '未知错误',
      timestamp: Date.now()
    };
    console.error('Captured Error:', errorInfo);
    this.showToast(errorInfo.message, 'error');
  }

  static handlePromiseRejection(event) {
    const errorInfo = {
      type: 'promise_rejection',
      message: event.reason?.message || '异步操作失败',
      timestamp: Date.now()
    };
    console.error('Captured Promise Rejection:', errorInfo);
    this.showToast(errorInfo.message, 'error');
  }

  static showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    // Tailwind classes for styling
    const baseClasses = 'px-4 py-3 rounded-xl shadow-lg transform transition-all duration-300 translate-y-[-20px] opacity-0 flex items-center gap-3 pointer-events-auto mx-4';
    const typeClasses = type === 'error' 
      ? 'bg-red-50 text-red-600 border border-red-100' 
      : 'bg-white text-gray-800 border border-gray-100';

    toast.className = `${baseClasses} ${typeClasses}`;
    
    const icon = type === 'error' 
      ? '<span class="iconify text-xl shrink-0" data-icon="heroicons:exclamation-circle-20-solid"></span>'
      : '<span class="iconify text-xl shrink-0" data-icon="heroicons:information-circle-20-solid"></span>';

    toast.innerHTML = `
      ${icon}
      <span class="text-sm font-medium leading-tight">${message}</span>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-[-20px]', 'opacity-0');
    });

    // Auto dismiss
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-[-20px]');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ErrorHandler.init());
} else {
  ErrorHandler.init();
}