function findCareer() {
    const hobbiesInput = document.getElementById('hobbies').value.toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!hobbiesInput) {
        resultsDiv.innerHTML = '<p>يرجى إدخال هواية للبحث عنها.</p>';
        return;
    }

    const careerMap = {
        'برمجة': 'مطور برمجيات، مهندس بيانات، أو مطور تطبيقات ويب.',
        'رسم': 'مصمم جرافيك، رسام رقمي، أو فنان تشكيلي.',
        'تصوير': 'مصور فوتوغرافي محترف، محرر فيديو، أو صانع محتوى بصري.',
        'كتابة': 'كاتب محتوى، مؤلف، أو مدون.',
        'طبخ': 'شيف محترف، كاتب وصفات، أو صاحب مشروع طعام منزلي.',
        'رياضة': 'مدرب رياضي، أخصائي تغذية، أو معلق رياضي.'
    };

    let found = false;
    for (let hobby in careerMap) {
        if (hobbiesInput.includes(hobby)) {
            const item = document.createElement('div');
            item.className = 'result-item';
            item.innerHTML = `<h3>${hobby}</h3><p>يمكنك العمل كـ: ${careerMap[hobby]}</p>`;
            resultsDiv.appendChild(item);
            found = true;
        }
    }

    if (!found) {
        resultsDiv.innerHTML = '<p>لم نجد مهنة مطابقة تماماً، ولكن يمكنك دائماً تحويل شغفك إلى عمل حر!</p>';
    }
}
