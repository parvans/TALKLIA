import React from 'react'

export default function UserLetterAvatar({ name }) {
    // Simple color palette
    const avatarColors = [
        "#FF6B6B", "#FF8C42", "#FFD93D", "#6BCB77", "#4D96FF",
        "#845EC2", "#FF9671", "#FFC75F", "#008E9B", "#C34A36"
    ];
    const getAvatarColor = (name) => {
        if (!name) return "#6C757D";
        const charCode = name.toUpperCase().charCodeAt(0);
        const index = charCode % avatarColors.length;
        const getLetter = (name) => name.charAt(0).toUpperCase();
        return {
            color: avatarColors[index],
            letter: getLetter(name),
        };
    };
    const getColLet =getAvatarColor(name);
    return (
        <div className='avatar placeholder online'>
            <div className='text-white w-10 h-10 rounded-full flex items-center justify-center' style={{ backgroundColor: getColLet.color }}>
                <span className="text-xl">{getColLet.letter}</span>
            </div>
        </div>
    )
}
