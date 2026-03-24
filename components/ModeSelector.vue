<!-- 计分模式选择组件 -->
<template>
    <view class="mode-section">
        <text class="section-label">计分模式</text>
        <view class="mode-selector">
            <view
                class="mode-btn"
                :class="{ active: modelValue === 'oneLose' }"
                @click="$emit('update:modelValue', 'oneLose')"
            >
                <image src="/static/icon/-sad.png" class="mode-icon-img" />
                <text class="mode-text">一人输所有</text>
            </view>
            <view
                class="mode-btn"
                :class="{ active: modelValue === 'oneWin' }"
                @click="$emit('update:modelValue', 'oneWin')"
            >
                <image src="/static/icon/xiaolian.png" class="mode-icon-img" />
                <text class="mode-text">一人赢所有</text>
            </view>
            <view
                class="mode-btn"
                :class="{ active: modelValue === 'mixed' }"
                @click="$emit('update:modelValue', 'mixed')"
            >
                <image
                    src="/static/icon/biaoqing-yigaiming-zhagehua_jingxia.png"
                    class="mode-icon-img"
                />
                <text class="mode-text">混合输赢</text>
            </view>
        </view>
    </view>
</template>

<script setup>
defineProps({
    modelValue: {
        type: String,
        required: true,
        validator: (value) => ['oneLose', 'oneWin', 'mixed'].includes(value)
    }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.mode-section {
    margin: 0 30rpx 30rpx;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20rpx;
    padding: 30rpx;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.section-label {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 20rpx;
    display: block;
}

.mode-selector {
    display: flex;
    gap: 20rpx;
    align-items: center; /* 垂直对齐 */
}

.mode-btn {
    flex: 1;
    background: #f5f5f5;
    border-radius: 16rpx;
    padding: 30rpx 20rpx;
    text-align: center;
    transition: all 0.3s;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.mode-btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transform: scale(1.02);
}

.mode-btn.active::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 16rpx;
    box-shadow: 0 0 0 3rpx #667eea;
    pointer-events: none;
}

.mode-icon-img {
    width: 48rpx;
    height: 48rpx;
    display: block;
    margin-bottom: 10rpx;
}

.mode-btn.active .mode-icon-img {
    opacity: 0.9;
}

.mode-text {
    font-size: 24rpx;
    color: #333;
    display: block;
}

.mode-btn.active .mode-text {
    color: #fff;
}
</style>
