// 信息提交页面逻辑
class SubmitForm {
    constructor() {
        this.form = document.getElementById('submitForm');
        this.prizeResult = document.getElementById('prizeResult');
        this.init();
    }

    init() {
        // 显示中奖信息
        this.displayPrizeInfo();
        
        // 绑定表单提交事件
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // 表单验证
        this.setupValidation();
    }

    displayPrizeInfo() {
        const prizeName = sessionStorage.getItem('prizeName');
        
        if (!prizeName || prizeName === '谢谢参与') {
            // 如果没有中奖信息或者是"谢谢参与"，返回首页
            alert('没有中奖信息，请先参与抽奖！');
            window.location.href = 'index.html';
            return;
        }
        
        // 隐藏 UI 提示（界面上不显示中奖提示），但在页面上设置样式以优化提交表单布局
        const submitPage = document.querySelector('.submit-page');
        if (submitPage) submitPage.classList.add('has-prize');

        // 将 prizeResult 保持在 DOM 但隐藏（以兼容现有逻辑）
        this.prizeResult.textContent = '';
    }

    setupValidation() {
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        
        // 手机号验证
        phoneInput.addEventListener('input', (e) => {
            const value = e.target.value;
            if (value && !/^1[3-9]\d{9}$/.test(value)) {
                phoneInput.setCustomValidity('请输入正确的11位手机号码');
            } else {
                phoneInput.setCustomValidity('');
            }
        });
        
        // 邮箱验证
        emailInput.addEventListener('input', (e) => {
            const value = e.target.value;
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                emailInput.setCustomValidity('请输入正确的邮箱地址');
            } else {
                emailInput.setCustomValidity('');
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // 获取表单数据
        const formData = {
            prizeName: sessionStorage.getItem('prizeName'),
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            email: document.getElementById('email').value,
            submitTime: new Date().toLocaleString('zh-CN')
        };
        
        // 这里可以将数据发送到后端服务器
        console.log('提交的数据：', formData);
        
        // 保存到 localStorage（实际项目中应该发送到服务器）
        this.saveToLocalStorage(formData);
        
        // 显示成功提示
        alert('信息提交成功！我们会尽快与您联系。');
        
        // 清除 sessionStorage
        sessionStorage.removeItem('prizeName');
        
        // 返回首页
        window.location.href = 'index.html';
    }

    saveToLocalStorage(formData) {
        // 获取已有的提交记录
        let submissions = JSON.parse(localStorage.getItem('lotterySubmissions') || '[]');
        
        // 添加新记录
        submissions.push(formData);
        
        // 保存回 localStorage
        localStorage.setItem('lotterySubmissions', JSON.stringify(submissions));
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new SubmitForm();
});
