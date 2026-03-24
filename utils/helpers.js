/**
 * 工具函数 - 格式化时间
 * @param {number} timestamp - 时间戳
 * @returns {string} 格式化后的时间 HH:mm
 */
export const formatTime = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

/**
 * 工具函数 - 格式化分数显示
 * @param {object} record - 分数记录 {type, score}
 * @returns {string} 格式化后的分数
 */
export const formatScore = (record) => {
    if (!record || record.type === 'zero') return '0';
    const sign = record.type === 'win' ? '+' : '-';
    return `${sign}${record.score}`;
};

/**
 * 获取模式标题
 * @param {string} mode - 模式类型
 * @returns {string} 模式标题
 */
export const getModeTitle = (mode) => {
    const titles = {
        oneLose: '一人输所有',
        oneWin: '一人赢所有',
        mixed: '混合输赢'
    };
    return titles[mode] || '';
};

/**
 * 获取模式描述
 * @param {string} mode - 模式类型
 * @returns {string} 模式描述
 */
export const getModeDesc = (mode) => {
    const descs = {
        oneLose: '选择输家，其他人输入赢的分数',
        oneWin: '选择赢家，其他人输入输的分数',
        mixed: '所有人输入分数，总和需为 0'
    };
    return descs[mode] || '';
};
