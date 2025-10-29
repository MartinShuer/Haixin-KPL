// 九宫格抽奖逻辑
class LotteryGame {
    constructor() {
        this.prizes = document.querySelectorAll('.prize');
        this.lotteryBtn = document.getElementById('lotteryBtn');
        this.isRunning = false;
        this.currentIndex = 0;
        this.prizeMapping = {
            0: '一等奖',
            1: '谢谢参与',
            2: '二等奖',
            3: '三等奖',
            4: '谢谢参与',
            5: '四等奖',
            6: '五等奖',
            7: '谢谢参与'
        };
    // 开启调试日志，页面控制台会打印跑马灯映射信息
    this.debug = true;
        
        // 定义旋转顺序（按prizes数组的DOM顺序来实现视觉顺时针）
    // prizes数组DOM顺序（this.prizes 列表中的 data-index 顺序）：0,1,2,7,3,6,5,4
    // 视觉顺时针的 data-index 顺序应为：0,1,2,3,4,5,6,7
    // 为了让 finalIndex（data-index）可以直接作为 rotate 的目标位置索引，
    // 我们把 rotateOrder 构造成：rotateOrder[dataIndex] = nodeIndex（this.prizes 的索引）。
    // 根据 DOM 顺序，映射得到：
    // data-index 0 -> nodeIndex 0
    // data-index 1 -> nodeIndex 1
    // data-index 2 -> nodeIndex 2
    // data-index 3 -> nodeIndex 4
    // data-index 4 -> nodeIndex 7
    // data-index 5 -> nodeIndex 6
    // data-index 6 -> nodeIndex 5
    // data-index 7 -> nodeIndex 3
    // 因此正确的 rotateOrder（nodeIndex 列表）为：
    this.rotateOrder = [0, 1, 2, 4, 7, 6, 5, 3];
        
        this.init();
    }

    init() {
        this.lotteryBtn.addEventListener('click', () => this.startLottery());
    }

    // 根据 data-index 值找到对应在 this.prizes 中的节点索引
    _getNodeIndexByDataIndex(dataIndex) {
        for (let i = 0; i < this.prizes.length; i++) {
            const pi = this.prizes[i];
            const di = pi.getAttribute('data-index');
            if (String(dataIndex) === String(di)) return i;
        }
        // 如果没找到，默认返回0
        return 0;
    }

    startLottery() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lotteryBtn.classList.add('disabled');
        
        // 随机决定中奖位置
        const finalDataIndex = this.getRandomPrize();

        // 找到 data-index 对应的 nodeIndex（this.prizes 的索引），再找到它在 rotateOrder 中的位置
        const nodeIndexForFinal = this._getNodeIndexByDataIndex(finalDataIndex);
        const targetRotatePos = this.rotateOrder.indexOf(nodeIndexForFinal);

        if (this.debug) {
            console.log('[lottery] finalDataIndex=', finalDataIndex, 'nodeIndexForFinal=', nodeIndexForFinal, 'targetRotatePos=', targetRotatePos);
        }

        // 计算旋转圈数和最终位置（使用 rotateOrder 的位置作为目标）
    const minRounds = 3; // 最少旋转3圈
    // 修复 off-by-one：确保最后一次高亮为 targetRotatePos，需要加 1
    const totalSteps = minRounds * this.rotateOrder.length + targetRotatePos + 1;

        // 传入 totalSteps（动画步数）和 finalDataIndex（用于结果展示）
        this.runRotation(totalSteps, finalDataIndex);
    }

    getRandomPrize() {
        // 设置中奖概率
        const random = Math.random() * 100;
        
        if (random < 5) {
            return 0; // 一等奖 5%
        } else if (random < 15) {
            return 2; // 二等奖 10%
        } else if (random < 30) {
            return 5; // 三等奖 15%
        } else if (random < 50) {
            return 7; // 四等奖 20%
        } else {
            // 谢谢参与 50%
            const noprizeIndexes = [1, 3, 4, 6];
            return noprizeIndexes[Math.floor(Math.random() * noprizeIndexes.length)];
        }
    }

    runRotation(totalSteps, finalIndex) {
        let currentStep = 0;
        let speed = 100; // 初始速度
        
        const rotate = () => {
            // 移除之前的高亮
            this.prizes.forEach(prize => prize.classList.remove('active'));
            
            // 当前高亮位置（nodeIndex）
            const currentPosition = this.rotateOrder[currentStep % this.rotateOrder.length];
            if (this.debug) {
                const di = this.prizes[currentPosition].getAttribute('data-index');
                console.log(`[lottery] step=${currentStep}, nodeIndex=${currentPosition}, data-index=${di}`);
            }
            this.prizes[currentPosition].classList.add('active');
            
            currentStep++;
            
            if (currentStep < totalSteps) {
                // 减速效果
                if (currentStep > totalSteps - 10) {
                    speed += 30;
                }
                setTimeout(rotate, speed);
            } else {
                // 抽奖结束
                setTimeout(() => {
                    if (this.debug) console.log('[lottery] animation end, showing result for data-index=', finalIndex);
                    this.showResult(finalIndex);
                }, 500);
            }
        };
        
        rotate();
    }

    showResult(index) {
        const prizeName = this.prizeMapping[index];

        // 保存中奖信息到 sessionStorage（供 submit 页读取）
        sessionStorage.setItem('prizeName', prizeName);

        const modal = document.getElementById('resultModal');
    const titleEl = document.getElementById('resultTitle');
    const descEl = document.getElementById('resultDesc');
    const confirmBtn = document.getElementById('resultConfirm');
    const imgWrap = document.querySelector('.result-img-wrap');
    const resultImg = document.getElementById('resultImg');

        // 设置标题与描述（更接近截图样式）
        const modalContent = document.querySelector('.result-modal-content');
        // 映射奖项到对应的 tan 图（与未中奖 thanks-tan.png 风格一致）
        const imageMap = {
            '一等奖': 'images/1st-tan.png',
            '二等奖': 'images/2nd-tan.png',
            '三等奖': 'images/3rd-tan.png',
            '四等奖': 'images/4th-tan.png',
            '五等奖': 'images/5th-tan.png',
            '谢谢参与': 'images/thanks-tan.png'
        };

        if (prizeName === '谢谢参与') {
            // 未中奖：image-only 模式，仅显示透明 png，铺满 9:16 区域，无其它底框，显示右上关闭
            modalContent.classList.add('image-only');
            modalContent.classList.remove('with-confirm');
            modal.classList.add('image-only');
            modal.classList.remove('with-confirm');
            imgWrap.classList.remove('hidden');
            resultImg.src = imageMap[prizeName];
            resultImg.alt = '谢谢参与';
            // 隐藏文本
            titleEl.style.display = 'none';
            descEl.style.display = 'none';
        } else {
            // 中奖：参考未中奖风格的图片弹窗，但需要显示中间的“确定”按钮并隐藏右上关闭按钮
            modalContent.classList.add('image-only', 'with-confirm');
            modal.classList.add('image-only');
            modal.classList.add('with-confirm');
            imgWrap.classList.remove('hidden');
            resultImg.src = imageMap[prizeName] || '';
            resultImg.alt = prizeName;
            // 隐藏文本（图片包含所有视觉信息）
            titleEl.style.display = 'none';
            descEl.style.display = 'none';
        }

        // 展示弹窗
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');

        // 解绑并重新绑定确认按钮
        const newBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

        newBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
            // 确保移除 image-only / with-confirm 标记以还原遮罩/样式
            modalContent.classList.remove('image-only', 'with-confirm');
            modal.classList.remove('image-only', 'with-confirm');
            if (prizeName !== '谢谢参与') {
                // 跳转到提交页
                window.location.href = 'submit.html';
            } else {
                this.reset();
            }
        });

        // 绑定关闭按钮（右上角），始终可用：仅关闭弹窗且不跳转
        const closeBtn = document.getElementById('resultClose');
        if (closeBtn) {
            const newClose = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newClose, closeBtn);
            newClose.addEventListener('click', () => {
                modal.classList.add('hidden');
                modal.setAttribute('aria-hidden', 'true');
                // 退出 image-only / with-confirm 模式以还原样式
                modalContent.classList.remove('image-only', 'with-confirm');
                modal.classList.remove('image-only', 'with-confirm');
                this.reset();
            });
        }
    }

    reset() {
        this.isRunning = false;
        this.lotteryBtn.classList.remove('disabled');
        this.prizes.forEach(prize => prize.classList.remove('active'));
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new LotteryGame();
});

// Align lottery grid center to decorative frame center for pixel-perfect placement
function alignLotteryGridToFrame() {
    const frame = document.querySelector('.decor-lottery-frame');
    const container = document.querySelector('.lottery-container');
    if (!frame || !container) return;

    // Find offset parent for container (should be .lottery-page)
    const parent = container.offsetParent || container.parentElement;
    const frameRect = frame.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    // compute center of frame relative to parent
    const centerX = frameRect.left + frameRect.width / 2 - parentRect.left;
    const centerY = frameRect.top + frameRect.height / 2 - parentRect.top;

    // Apply absolute left/top in pixels and keep the vertical offset from --grid-top as baseline
    // We'll set left to centerX (in px) and keep transform translate(-50%,-50%) so container centers at that point
    container.style.left = centerX + 'px';
    // set top to either computed centerY or keep existing var(--grid-top) translated to pixels
    container.style.top = centerY + 'px';
    container.style.transform = 'translate(-50%, -50%)';
}

// Run alignment on load and on resize (debounced)
window.addEventListener('load', () => {
    alignLotteryGridToFrame();
});
let __alignTimer = null;
window.addEventListener('resize', () => {
    clearTimeout(__alignTimer);
    __alignTimer = setTimeout(alignLotteryGridToFrame, 120);
});

// Also re-run when images (background or decor) load which may shift layout
const imgs = document.querySelectorAll('img');
imgs.forEach(img => {
    if (!img.complete) img.addEventListener('load', () => setTimeout(alignLotteryGridToFrame, 40));
});
