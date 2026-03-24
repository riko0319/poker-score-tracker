<!-- 玩家列表组件 -->
<template>
    <view class="players-section">
        <view class="section-header">
            <text class="section-title">玩家列表 ({{ players.length }}人)</text>
            <button class="add-btn" @click="$emit('add')">
                <image
                    src="/static/icon/a-keaiyouqudeganxingqubiaoqingxiaolian.png"
                    class="add-icon-img"
                />
                <text>添加玩家</text>
            </button>
        </view>

        <view v-if="players.length === 0" class="empty-state">
            <text class="empty-icon">👥</text>
            <text class="empty-text">暂无玩家，点击添加</text>
        </view>

        <view v-else class="players-list">
            <view
                class="player-item"
                v-for="(item, index) in players"
                :key="index"
                :style="{ '--color': colorArr[index % colorArr.length] }"
            >
                <image
                    :src="`/static/avatars/${item.imageId || '1'}.png`"
                    mode="aspectFill"
                    class="player-avatar"
                />
                <view class="player-info">
                    <text class="player-name">{{ item.name }}</text>
                    <text
                        class="player-score"
                        :class="{
                            win: scores[item.name] > 0,
                            lose: scores[item.name] < 0
                        }"
                    >
                        {{ scores[item.name] > 0 ? '+' : ''
                        }}{{ scores[item.name] || 0 }}
                    </text>
                </view>
                <view class="player-actions">
                    <image
                        src="/static/icon/shanchu.png"
                        class="delete-icon-img"
                        @click="$emit('remove', index)"
                    />
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
const colorArr = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E9',
    '#F8C471',
    '#82E0AA',
    '#F1948A',
    '#85C1E9',
    '#D7BDE2'
];

defineProps({
    players: {
        type: Array,
        required: true
    },
    scores: {
        type: Object,
        required: true
    }
});

defineEmits(['add', 'remove']);
</script>

<style scoped>
.players-section {
    margin: 0 30rpx;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20rpx;
    padding: 30rpx;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
}

.section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
}

.add-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    font-size: 26rpx;
    padding: 0 30rpx;
    border-radius: 30rpx;
    border: none;
    height: 60rpx;
    line-height: normal;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
}

.add-icon-img {
    width: 32rpx;
    height: 32rpx;
}

.add-btn::after {
    display: none;
}

.empty-state {
    text-align: center;
    padding: 80rpx 0;
}

.empty-icon {
    font-size: 80rpx;
    display: block;
    margin-bottom: 20rpx;
}

.empty-text {
    font-size: 28rpx;
    color: #999;
}

.players-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.player-item {
    display: flex;
    align-items: center;
    background: #f8f9fa;
    border-radius: 16rpx;
    padding: 20rpx;
    position: relative;
    overflow: hidden;
}

.player-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 6rpx;
    background-color: var(--color);
}

.player-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-right: 20rpx;
}

.player-info {
    flex: 1;
}

.player-name {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    display: block;
    margin-bottom: 8rpx;
}

.player-score {
    font-size: 36rpx;
    font-weight: bold;
    color: #666;
}

.player-score.win {
    color: #52c41a;
}

.player-score.lose {
    color: #ff4d4f;
}

.player-actions {
    padding: 0 10rpx;
}

.delete-icon-img {
    width: 40rpx;
    height: 40rpx;
    opacity: 0.8;
}
</style>
