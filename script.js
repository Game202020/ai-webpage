function findCareer() {
    const hobbiesInput = document.getElementById("hobbies").value;
    const resultsContainer = document.getElementById("results");

    if (!hobbiesInput) {
        alert("من فضلك أدخل بعض الهوايات!");
        return;
    }

    // هنا سنقوم بتحليل الهوايات المدخلة وتقديم اقتراحات بناءً عليها
    const hobbies = hobbiesInput.split(",").map(hobby => hobby.trim().toLowerCase());

    const careerRecommendations = analyzeHobbies(hobbies);

    // عرض النتائج للمستخدم
    displayResults(careerRecommendations);
}

function analyzeHobbies(hobbies) {
    const recommendations = [];

    // التوصيات بناءً على الهوايات المدخلة
    if (hobbies.includes("برمجة")) {
        recommendations.push({
            title: "مطور برامج",
            description: "تعلم البرمجة وابدأ بتطوير التطبيقات أو مواقع الويب.",
            courses: ["دورة تعلم البرمجة باستخدام Python", "دورة JavaScript للمبتدئين"]
        });
    }

    if (hobbies.includes("رسم")) {
        recommendations.push({
            title: "فنان مستقل",
            description: "يمكنك عرض أعمالك الفنية على الإنترنت وبيعها.",
            courses: ["دورة رسم الأساسيات", "دورة Photoshop لفناني الرسوم"]
        });
    }

    if (hobbies.includes("تصوير")) {
        recommendations.push({
            title: "مصور محترف",
            description: "ابدأ بتعلم التصوير الفوتوغرافي وبيع خدماتك.",
            courses: ["دورة التصوير الفوتوغرافي للمبتدئين", "دورة تصوير المنتج"]
        });
    }

    // إضافة توصيات أخرى للهوايات المختلفة
    if (hobbies.includes("كتابة")) {
        recommendations.push({
            title: "كاتب مستقل",
            description: "ابدأ الكتابة للأفراد أو الشركات على الإنترنت.",
            courses: ["دورة كتابة المحتوى", "دورة الكتابة الإبداعية"]
        });
    }

    return recommendations;
}

function displayResults(recommendations) {
    const resultsContainer = document.getElementById("results");

    // مسح النتائج السابقة
    resultsContainer.innerHTML = "";

    if (recommendations.length === 0) {
        resultsContainer.innerHTML = "<p>لم نجد توصيات بناءً على الهوايات المدخلة. حاول إدخال هوايات أخرى.</p>";
        return;
    }

    recommendations.forEach(rec => {
        const resultItem = document.createElement("div");
        resultItem.className = "result-item";
        resultItem.innerHTML = `
            <h3>${rec.title}</h3>
            <p>${rec.description}</p>
            <h4>الدورات المقترحة:</h4>
            <ul>
                ${rec.courses.map(course => `<li>${course}</li>`).join('')}
            </ul>
        `;
        resultsContainer.appendChild(resultItem);
    });
}
