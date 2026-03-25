<template>
    <view class="container">
        <!-- 顶部标题栏 -->
        <view class="nav-bar">
            <image src="/static/icon/pukepai.png" class="nav-icon" />
            <text class="nav-title">✨ 牌友计分器 ✨</text>
        </view>

        <!-- 使用模式选择组件 -->
        <ModeSelector v-model="currentMode" />

        <!-- 操作按钮区 -->
        <view class="action-bar">
            <button class="action-btn primary" @click="openScoreDialog">
                <image src="/static/icon/ziyuan.png" class="btn-icon-img" />
                <text>单轮计分</text>
            </button>
            <button class="action-btn secondary" @click="openLog">
                <image
                    src="/static/icon/caozuorizhi.png"
                    class="btn-icon-img"
                />
                <text>查看日志</text>
            </button>
        </view>

        <!-- 使用玩家列表组件 -->
        <PlayerList
            :players="userList"
            :scores="totalScores"
            @add="createNewUser"
            @remove="removeUser"
        />

        <!-- 底部操作 -->
        <view class="footer-actions">
            <button class="footer-btn default" @click="returnZero">
                <image
                    src="/static/icon/shoudongshuaxinyemian.png"
                    class="footer-icon-img"
                />
                <text>分数归零</text>
            </button>
            <button class="footer-btn danger" @click="clearAll">
                <image
                    src="/static/icon/qingkong.png"
                    class="footer-icon-img"
                />
                <text>清空全部</text>
            </button>
        </view>

        <!-- 添加玩家弹窗 -->
        <uni-popup ref="inputDialog" type="dialog">
            <uni-popup-dialog
                mode="input"
                title="添加新玩家"
                placeholder="请输入玩家名称"
                @confirm="confirmUser"
            ></uni-popup-dialog>
        </uni-popup>

        <!-- 单轮计分弹窗 -->
        <uni-popup ref="scoreDialog" type="center">
            <view class="score-popup">
                <view class="popup-header">
                    <text class="popup-title">{{ getModeTitle() }}</text>
                    <text class="popup-desc">{{ getModeDesc() }}</text>
                </view>

                <scroll-view class="popup-scroll-content" scroll-y>
                    <!-- 一人输所有 / 一人赢所有 模式 -->
                    <view
                        v-if="
                            currentMode === 'oneLose' ||
                            currentMode === 'oneWin'
                        "
                    >
                        <view class="special-player-section">
                            <text class="section-tip">
                                {{
                                    currentMode === 'oneLose'
                                        ? '👇 选择输家（自动计算输分）'
                                        : '👇 选择赢家（自动计算赢分）'
                                }}
                            </text>
                            <scroll-view class="sp-scroll" scroll-x>
                                <view class="special-player-list">
                                    <view
                                        v-for="(item, index) in userList"
                                        :key="index"
                                        class="special-player-item"
                                        :class="{
                                            selected:
                                                specialPlayer === item.name
                                        }"
                                        @click="selectSpecialPlayer(item.name)"
                                    >
                                        <image
                                            :src="`/static/avatars/${item.imageId || '1'}.png`"
                                            mode="aspectFill"
                                            class="sp-avatar"
                                        />
                                        <text class="sp-name">{{
                                            item.name
                                        }}</text>
                                        <text
                                            v-if="specialPlayer === item.name"
                                            class="sp-check"
                                            >✓</text
                                        >
                                    </view>
                                </view>
                            </scroll-view>
                        </view>

                        <view class="others-section" v-if="specialPlayer">
                            <text class="section-tip">
                                {{
                                    currentMode === 'oneLose'
                                        ? '👇 其他人输入赢的分数'
                                        : '👇 其他人输入输的分数'
                                }}
                            </text>
                            <view class="score-input-list">
                                <view
                                    v-for="(item, index) in userList"
                                    :key="index"
                                    v-show="item.name !== specialPlayer"
                                    class="score-input-item"
                                >
                                    <image
                                        :src="`/static/avatars/${item.imageId || '1'}.png`"
                                        mode="aspectFill"
                                        class="si-avatar"
                                    />
                                    <text class="si-name">{{ item.name }}</text>
                                    <input
                                        class="si-input"
                                        type="number"
                                        placeholder="0"
                                        v-model="item.tempScore"
                                    />
                                </view>
                            </view>
                            <view class="total-preview">
                                <text
                                    >{{
                                        currentMode === 'oneLose'
                                            ? '输家输'
                                            : '赢家赢'
                                    }}: {{ calculateSpecialTotal() }} 分</text
                                >
                            </view>
                        </view>
                    </view>

                    <!-- 混合输赢模式 -->
                    <view v-else-if="currentMode === 'mixed'">
                        <view class="mixed-section">
                            <text class="section-tip"
                                >👇 滑动选择输赢，输入分数（自动计算总和）</text
                            >
                            <view class="score-input-list">
                                <view
                                    v-for="(item, index) in userList"
                                    :key="index"
                                    class="score-input-item"
                                >
                                    <image
                                        :src="`/static/avatars/${item.imageId || '1'}.png`"
                                        mode="aspectFill"
                                        class="si-avatar"
                                    />
                                    <text class="si-name">{{ item.name }}</text>
                                    <view class="toggle-container">
                                        <view
                                            class="toggle-btn"
                                            :class="
                                                item.toggleType !== 'lose'
                                                    ? 'active win'
                                                    : ''
                                            "
                                            @click="item.toggleType = 'win'"
                                        >
                                            赢
                                        </view>
                                        <view
                                            class="toggle-btn"
                                            :class="
                                                item.toggleType === 'lose'
                                                    ? 'active lose'
                                                    : ''
                                            "
                                            @click="item.toggleType = 'lose'"
                                        >
                                            输
                                        </view>
                                    </view>
                                    <input
                                        class="si-input"
                                        type="number"
                                        placeholder="0"
                                        v-model="item.tempScore"
                                    />
                                </view>
                            </view>
                            <view
                                class="balance-check"
                                :class="{ valid: isBalanced() }"
                            >
                                <text
                                    >总和：{{ calculateMixedTotal() }}
                                    {{
                                        isBalanced() ? '✓ 已平账' : '✗ 需为 0'
                                    }}</text
                                >
                            </view>
                        </view>
                    </view>
                </scroll-view>

                <view class="popup-footer">
                    <button class="popup-btn cancel" @click="closeScoreDialog">
                        取消
                    </button>
                    <button class="popup-btn confirm" @click="submitScore">
                        确认
                    </button>
                </view>
            </view>
        </uni-popup>

        <!-- 日志弹窗 -->
        <uni-popup ref="logDialog" type="center">
            <view class="log-popup">
                <view class="popup-header">
                    <text class="popup-title">📋 计分日志</text>
                    <text class="popup-desc"
                        >共 {{ logList.length }} 轮记录</text
                    >
                </view>

                <scroll-view class="log-content" scroll-x scroll-y>
                    <view v-if="logList.length === 0" class="empty-state">
                        <text class="empty-icon">📝</text>
                        <text class="empty-text">暂无记录</text>
                    </view>

                    <view v-else class="log-list">
                        <!-- 表头 -->
                        <view class="log-header">
                            <view class="log-cell time">时间</view>
                            <view class="log-cell round">轮次</view>
                            <view
                                class="log-cell player"
                                v-for="(item, index) in userList"
                                :key="index"
                            >
                                {{ item.name }}
                            </view>
                        </view>

                        <!-- 数据行 -->
                        <view
                            class="log-row"
                            v-for="(log, index) in logList"
                            :key="index"
                        >
                            <view class="log-cell time">{{
                                formatTime(log.time)
                            }}</view>
                            <view class="log-cell round">{{ index + 1 }}</view>
                            <view
                                class="log-cell player"
                                v-for="(player, pIndex) in userList"
                                :key="pIndex"
                                :class="{
                                    win:
                                        log.scores[player.name]?.type === 'win',
                                    lose:
                                        log.scores[player.name]?.type === 'lose'
                                }"
                            >
                                {{ formatScore(log.scores[player.name]) }}
                            </view>
                        </view>

                        <!-- 总计行 -->
                        <view class="log-row total">
                            <view class="log-cell time">-</view>
                            <view class="log-cell round">总计</view>
                            <view
                                class="log-cell player"
                                v-for="(player, pIndex) in userList"
                                :key="pIndex"
                                :class="{
                                    win: totalScores[player.name] > 0,
                                    lose: totalScores[player.name] < 0
                                }"
                            >
                                {{ totalScores[player.name] > 0 ? '+' : ''
                                }}{{ totalScores[player.name] || 0 }}
                            </view>
                        </view>
                    </view>
                </scroll-view>

                <view class="popup-footer">
                    <button class="popup-btn confirm" @click="closeLogDialog">
                        关闭
                    </button>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad, onUnload, onHide } from '@dcloudio/uni-app';
import ModeSelector from '@/components/ModeSelector.vue';
import PlayerList from '@/components/PlayerList.vue';
import {
    formatTime,
    formatScore,
    getModeTitle,
    getModeDesc
} from '@/utils/helpers';

// ============ Refs ============
const inputDialog = ref(null);
const scoreDialog = ref(null);
const logDialog = ref(null);

const userList = ref([]);
const logList = ref([]);
const currentMode = ref('oneLose'); // oneLose, oneWin, mixed
const specialPlayer = ref(''); // 一人输/赢模式中选中的玩家

// ============ 计算属性 ============
const totalScores = computed(() => {
    const scores = {};
    userList.value.forEach((player) => {
        scores[player.name] = 0;
    });

    logList.value.forEach((round) => {
        Object.entries(round.scores).forEach(([playerName, record]) => {
            if (record.type === 'win') {
                scores[playerName] = (scores[playerName] || 0) + record.score;
            } else if (record.type === 'lose') {
                scores[playerName] = (scores[playerName] || 0) - record.score;
            }
        });
    });

    return scores;
});

// ============ 生命周期 ============
onLoad(() => {
    loadData();
});

onUnload(() => {
    saveData();
});

onHide(() => {
    saveData();
});

// ============ 数据持久化 ============
const saveData = () => {
    uni.setStorageSync('cardGame_userList', userList.value);
    uni.setStorageSync('cardGame_logList', logList.value);
    uni.setStorageSync('cardGame_mode', currentMode.value);
};

const loadData = () => {
    try {
        const storedUsers = uni.getStorageSync('cardGame_userList');
        const storedLogs = uni.getStorageSync('cardGame_logList');
        const storedMode = uni.getStorageSync('cardGame_mode');

        if (Array.isArray(storedUsers)) {
            userList.value = storedUsers.map((u) => ({
                ...u,
                tempScore: ''
            }));
        }
        if (Array.isArray(storedLogs)) {
            logList.value = storedLogs;
        }
        if (storedMode) {
            currentMode.value = storedMode;
        }
    } catch (e) {
        console.error('加载数据失败:', e);
    }
};

const clearCache = () => {
    uni.removeStorageSync('cardGame_userList');
    uni.removeStorageSync('cardGame_logList');
    uni.removeStorageSync('cardGame_mode');
};

// ============ 玩家管理 ============
const createNewUser = () => {
    inputDialog.value?.open();
};

const confirmUser = (name) => {
    if (!name || !name.trim()) {
        uni.showToast({ title: '请输入有效的名称', icon: 'none' });
        return;
    }
    const trimmedName = name.trim();
    if (userList.value.some((item) => item.name === trimmedName)) {
        uni.showToast({ title: '该玩家已存在', icon: 'none' });
        return;
    }
    userList.value.push({
        name: trimmedName,
        score: 0,
        tempScore: '',
        toggleType: 'win', // 默认赢
        imageId: Math.floor(Math.random() * 8) + 1
    });
};

const removeUser = (index) => {
    uni.showModal({
        title: '确认删除',
        content: `确定要删除玩家 "${userList.value[index].name}" 吗？`,
        success: (res) => {
            if (res.confirm) {
                userList.value.splice(index, 1);
            }
        }
    });
};

// ============ 计分弹窗 ============
const openScoreDialog = () => {
    if (userList.value.length < 2) {
        uni.showToast({ title: '至少需要 2 名玩家', icon: 'none' });
        return;
    }
    specialPlayer.value = '';
    userList.value.forEach((item) => {
        item.tempScore = '';
        item.toggleType = 'win'; // 重置为赢
    });
    scoreDialog.value?.open();
};

const closeScoreDialog = () => {
    scoreDialog.value?.close();
};

const selectSpecialPlayer = (name) => {
    specialPlayer.value = name;
};

const calculateSpecialTotal = () => {
    return userList.value.reduce((sum, item) => {
        if (item.name !== specialPlayer.value) {
            return sum + (Number(item.tempScore) || 0);
        }
        return sum;
    }, 0);
};

const calculateMixedTotal = () => {
    return userList.value.reduce((sum, item) => {
        const score = Number(item.tempScore) || 0;
        // 根据 toggleType 计算：赢为正，输为负
        return sum + (item.toggleType === 'win' ? score : -score);
    }, 0);
};

const isBalanced = () => {
    return calculateMixedTotal() === 0;
};

const submitScore = () => {
    // 一人输所有模式
    if (currentMode.value === 'oneLose') {
        if (!specialPlayer.value) {
            uni.showToast({ title: '请选择输家', icon: 'none' });
            return;
        }
        const total = calculateSpecialTotal();
        if (total <= 0) {
            uni.showToast({ title: '其他人赢分总和必须大于0', icon: 'none' });
            return;
        }

        const logEntry = {
            time: Date.now(),
            mode: 'oneLose',
            scores: {}
        };

        userList.value.forEach((player) => {
            if (player.name === specialPlayer.value) {
                logEntry.scores[player.name] = { type: 'lose', score: total };
            } else {
                const score = Number(player.tempScore) || 0;
                logEntry.scores[player.name] = {
                    type: score > 0 ? 'win' : 'zero',
                    score: score
                };
            }
        });

        logList.value.push(logEntry);
        closeScoreDialog();
        uni.showToast({ title: '计分成功', icon: 'success' });
    }

    // 一人赢所有模式
    else if (currentMode.value === 'oneWin') {
        if (!specialPlayer.value) {
            uni.showToast({ title: '请选择赢家', icon: 'none' });
            return;
        }
        const total = calculateSpecialTotal();
        if (total <= 0) {
            uni.showToast({ title: '其他人输分总和必须大于0', icon: 'none' });
            return;
        }

        const logEntry = {
            time: Date.now(),
            mode: 'oneWin',
            scores: {}
        };

        userList.value.forEach((player) => {
            if (player.name === specialPlayer.value) {
                logEntry.scores[player.name] = { type: 'win', score: total };
            } else {
                const score = Number(player.tempScore) || 0;
                logEntry.scores[player.name] = {
                    type: score > 0 ? 'lose' : 'zero',
                    score: score
                };
            }
        });

        logList.value.push(logEntry);
        closeScoreDialog();
        uni.showToast({ title: '计分成功', icon: 'success' });
    }

    // 混合输赢模式
    else if (currentMode.value === 'mixed') {
        // 先处理所有输入：空值或非数字都转为 0
        const processedScores = userList.value.map((player) => {
            let score = Number(player.tempScore);
            if (
                isNaN(score) ||
                player.tempScore === '' ||
                player.tempScore === null
            ) {
                score = 0;
            }
            return {
                name: player.name,
                score: Math.abs(score), // 取绝对值
                type: player.toggleType || 'win' // 默认赢
            };
        });

        // 计算总和（赢为正，输为负）
        const total = processedScores.reduce((sum, p) => {
            return sum + (p.type === 'win' ? p.score : -p.score);
        }, 0);

        // 检查是否平账
        if (total !== 0) {
            uni.showToast({
                title: `当前总和：${total}，需为 0 才能提交`,
                icon: 'none'
            });
            return;
        }

        const logEntry = {
            time: Date.now(),
            mode: 'mixed',
            scores: {}
        };

        processedScores.forEach((p) => {
            if (p.score > 0) {
                logEntry.scores[p.name] = {
                    type: p.type === 'win' ? 'win' : 'lose',
                    score: p.score
                };
            } else {
                logEntry.scores[p.name] = { type: 'zero', score: 0 };
            }
        });

        logList.value.push(logEntry);
        closeScoreDialog();
        uni.showToast({ title: '计分成功', icon: 'success' });
    }
};

// ============ 日志 ============
const openLog = () => {
    logDialog.value?.open();
};

const closeLogDialog = () => {
    logDialog.value?.close();
};

// ============ 其他操作 ============
const returnZero = () => {
    uni.showModal({
        title: '确认归零',
        content: '确定要将所有玩家分数归零吗？',
        success: (res) => {
            if (res.confirm) {
                // 清空日志，这样页面上显示的分数就会归零
                logList.value = [];
                uni.showToast({ title: '已归零', icon: 'success' });
            }
        }
    });
};

const clearAll = () => {
    uni.showModal({
        title: '确认清空',
        content: '确定要清空所有玩家、分数和日志吗？此操作不可恢复！',
        success: (res) => {
            if (res.confirm) {
                userList.value = [];
                logList.value = [];
                clearCache();
                uni.showToast({ title: '已清空', icon: 'success' });
            }
        }
    });
};
</script>

<style>
/* ============ 基础样式 ============ */
.container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding-bottom: 120rpx;
}

/* ============ 导航栏 ============ */
.nav-bar {
    padding: 40rpx 30rpx 30rpx;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-icon {
    width: 48rpx;
    height: 48rpx;
    margin-right: 10rpx;
}

.nav-title {
    font-size: 40rpx;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* ============ 模式选择区 ============ */
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
}

.mode-btn {
    flex: 1;
    background: #f5f5f5;
    border-radius: 16rpx;
    padding: 30rpx 20rpx;
    text-align: center;
    transition: all 0.3s;
    position: relative;
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

.mode-btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transform: scale(1.02);
}

.mode-icon {
    font-size: 48rpx;
    display: block;
    margin-bottom: 10rpx;
}

.mode-text {
    font-size: 24rpx;
    color: #333;
    display: block;
}

/* ============ 操作按钮区 ============ */
.action-bar {
    display: flex;
    gap: 20rpx;
    margin: 0 30rpx 30rpx;
}

.action-btn {
    flex: 1;
    height: 80rpx;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
    font-size: 30rpx;
    color: #fff;
    border: none;
    padding: 0;
    margin: 0;
    line-height: normal;
    background-clip: content-box;
}

.action-btn::after {
    display: none;
}

.action-btn.primary {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    box-shadow: 0 4px 15px rgba(17, 153, 142, 0.4);
}

.action-btn.secondary {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
}

.btn-icon-img {
    width: 36rpx;
    height: 36rpx;
}

.footer-icon-img {
    width: 32rpx;
    height: 32rpx;
    margin-right: 8rpx;
}

/* ============ 底部操作 ============ */
.footer-actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: 20rpx;
    padding: 20rpx 30rpx;
    background: #fff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.footer-btn {
    flex: 1;
    height: 80rpx;
    border-radius: 40rpx;
    font-size: 28rpx;
    color: #fff;
    border: none;
    padding: 0;
    margin: 0;
    line-height: normal;
    display: flex;
    align-items: center;
    justify-content: center;
}

.footer-btn::after {
    display: none;
}

.footer-btn.default {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.footer-btn.danger {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
}

/* ============ 弹窗样式 ============ */
.score-popup,
.log-popup {
    width: 86vw;
    max-height: 80vh;
    background: #fff;
    border-radius: 24rpx;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.popup-scroll-content {
    max-height: 55vh;
    padding: 0 20rpx;
}

.popup-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 24rpx 30rpx;
    text-align: center;
    flex-shrink: 0;
}

.popup-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #fff;
    display: block;
    margin-bottom: 6rpx;
}

.popup-desc {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.9);
}

.section-tip {
    font-size: 26rpx;
    color: #666;
    padding: 20rpx 24rpx;
    display: block;
}

/* 特殊玩家选择 */
.special-player-section {
    padding: 0 24rpx;
}

.sp-scroll {
    width: 100%;
    white-space: nowrap;
}

.special-player-list {
    display: inline-flex;
    flex-wrap: nowrap;
    gap: 16rpx;
    padding: 8rpx;
}

.special-player-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16rpx;
    background: #f5f5f5;
    border-radius: 16rpx;
    min-width: 120rpx;
    position: relative;
}

.special-player-item.selected {
    background: #e6f7ff;
    box-shadow: 0 0 0 3rpx #1890ff;
}

.sp-avatar {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    margin-bottom: 8rpx;
}

.sp-name {
    font-size: 24rpx;
    color: #333;
}

.sp-check {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    width: 32rpx;
    height: 32rpx;
    background: #1890ff;
    color: #fff;
    border-radius: 50%;
    font-size: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 分数输入列表 */
.others-section,
.mixed-section {
    padding: 0 24rpx;
}

.score-input-list {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
}

.score-input-item {
    display: flex;
    align-items: center;
    background: #f8f9fa;
    border-radius: 12rpx;
    padding: 16rpx 20rpx;
}

.si-avatar {
    width: 56rpx;
    height: 56rpx;
    border-radius: 50%;
    margin-right: 16rpx;
}

.si-name {
    flex: 1;
    font-size: 28rpx;
    color: #333;
}

.si-input {
    width: 140rpx;
    height: 64rpx;
    background: #fff;
    border-radius: 10rpx;
    text-align: center;
    font-size: 30rpx;
    color: #333;
}

/* 滑块容器 */
.toggle-container {
    display: flex;
    gap: 8rpx;
    margin-right: 16rpx;
}

/* 滑块按钮 */
.toggle-btn {
    width: 70rpx;
    height: 56rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border-radius: 8rpx;
    font-size: 26rpx;
    font-weight: bold;
    color: #999;
    transition: all 0.3s;
    border: 2rpx solid transparent;
}

.toggle-btn.active.win {
    background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
    color: #fff;
    border-color: #52c41a;
}

.toggle-btn.active.lose {
    background: linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%);
    color: #fff;
    border-color: #ff4d4f;
}

.total-preview {
    text-align: center;
    padding: 24rpx;
    font-size: 30rpx;
    color: #333;
    font-weight: bold;
}

.balance-check {
    text-align: center;
    padding: 24rpx;
    font-size: 30rpx;
    color: #ff4d4f;
    font-weight: bold;
}

.balance-check.valid {
    color: #52c41a;
}

/* 弹窗底部 */
.popup-footer {
    display: flex;
    gap: 20rpx;
    padding: 24rpx 30rpx;
    border-top: 1rpx solid #f0f0f0;
    flex-shrink: 0;
    justify-content: center; /* 水平居中 */
}

.popup-btn {
    flex: 1;
    height: 76rpx;
    border-radius: 38rpx;
    font-size: 30rpx;
    border: none;
    padding: 0;
    margin: 0;
    line-height: normal;
    display: flex;
    align-items: center;
    justify-content: center;
}

.popup-btn::after {
    display: none;
}

.popup-btn.cancel {
    background: #f5f5f5;
    color: #666;
}

.popup-btn.confirm {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
}

/* ============ 日志样式 ============ */
.log-content {
    max-height: 55vh;
    padding: 0 20rpx;
}

.log-list {
    display: flex;
    flex-direction: column;
    min-width: fit-content;
}

.log-header,
.log-row {
    display: flex;
    align-items: center;
    height: 72rpx;
    border-bottom: 1rpx solid #f0f0f0;
    white-space: nowrap;
}

.log-header {
    background: #f8f9fa;
    font-weight: bold;
}

.log-row.total {
    background: #fff7e6;
    font-weight: bold;
}

.log-cell {
    padding: 0 16rpx;
    text-align: center;
    font-size: 26rpx;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    box-sizing: border-box;
}

.log-cell.time {
    width: 100rpx;
    flex-shrink: 0;
}

.log-cell.round {
    width: 80rpx;
    flex-shrink: 0;
}

.log-cell.player {
    width: 120rpx;
    flex-shrink: 0;
}

.log-cell.win {
    color: #52c41a;
}

.log-cell.lose {
    color: #ff4d4f;
}
</style>
