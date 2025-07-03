import { Project } from "@/lib/database";

// Simple PDF export using HTML and CSS
export const exportProjectToPDF = (project: Project) => {
  const materials = [
    { name: "الطوب/البلوك", quantity: project.bricks, unit: "وحدة", price: project.brickPrice },
    { name: "الإسمنت", quantity: project.cement, unit: "كيس 50كغ", price: project.cementPrice },
    { name: "الرمل", quantity: project.sand, unit: "م³", price: project.sandPrice },
    { name: "الحديد", quantity: project.steel, unit: "كغ", price: project.steelPrice },
    { name: "الحصى", quantity: project.gravel, unit: "م³", price: project.gravelPrice }
  ];

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>تقرير المشروع - ${project.name}</title>
      <style>
        body {
          font-family: 'Noto Sans Arabic', Arial, sans-serif;
          margin: 40px;
          color: #333;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #1e40af;
          padding-bottom: 20px;
        }
        .project-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .materials-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .materials-table th,
        .materials-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: center;
        }
        .materials-table th {
          background: #1e40af;
          color: white;
        }
        .cost-summary {
          background: #e3f2fd;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #1e40af;
        }
        .total-cost {
          font-size: 24px;
          font-weight: bold;
          color: #1e40af;
          text-align: center;
          margin-top: 20px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏗️ حاسبة مواد البناء</h1>
        <h2>تقرير المشروع: ${project.name}</h2>
        <p>تاريخ الإنشاء: ${new Date(project.createdAt).toLocaleDateString('ar-DZ')}</p>
      </div>

      <div class="project-info">
        <h3>تفاصيل المشروع</h3>
        <p><strong>المساحة:</strong> ${project.length}م × ${project.width}م</p>
        <p><strong>عدد الطوابق:</strong> ${project.floors}</p>
        <p><strong>سمك الجدران:</strong> ${project.wallThickness} سم</p>
        <p><strong>ارتفاع السقف:</strong> ${project.ceilingHeight} م</p>
        <p><strong>سور خارجي:</strong> ${project.includeWall ? "نعم" : "لا"}</p>
        <p><strong>بلاطة خرسانية:</strong> ${project.includeSlab ? "نعم" : "لا"}</p>
      </div>

      <h3>الكميات والتكاليف المطلوبة</h3>
      <table class="materials-table">
        <thead>
          <tr>
            <th>المادة</th>
            <th>الكمية</th>
            <th>الوحدة</th>
            <th>السعر</th>
            <th>التكلفة الإجمالية</th>
          </tr>
        </thead>
        <tbody>
          ${materials.map(material => `
            <tr>
              <td>${material.name}</td>
              <td>${material.quantity.toLocaleString('ar-DZ', { maximumFractionDigits: 1 })}</td>
              <td>${material.unit}</td>
              <td>${material.price.toLocaleString('ar-DZ')} د.ج</td>
              <td>${(material.quantity * material.price).toLocaleString('ar-DZ')} د.ج</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="cost-summary">
        <h3>ملخص التكاليف</h3>
        <p><strong>مجموع تكلفة المواد:</strong> ${project.totalMaterialCost.toLocaleString('ar-DZ')} د.ج</p>
        <p><strong>نسبة الاحتياطي (${project.contingencyPercent}%):</strong> ${(project.finalCost - project.totalMaterialCost).toLocaleString('ar-DZ')} د.ج</p>
        <div class="total-cost">
          التكلفة النهائية: ${project.finalCost.toLocaleString('ar-DZ')} د.ج
        </div>
      </div>

      <div class="footer">
        <p>تم إنشاء هذا التقرير بواسطة تطبيق حاسبة مواد البناء</p>
        <p>هذه الحسابات تقديرية وقد تختلف حسب ظروف الموقع وطريقة التنفيذ</p>
      </div>
    </body>
    </html>
  `;

  // Create blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `تقرير-${project.name}-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Share project data as text
export const shareProject = async (project: Project) => {
  const shareText = `
🏗️ مشروع: ${project.name}
📐 المساحة: ${project.length}م × ${project.width}م
🏢 الطوابق: ${project.floors}

📋 المواد المطلوبة:
• الطوب: ${project.bricks.toLocaleString('ar-DZ')} وحدة
• الإسمنت: ${project.cement.toLocaleString('ar-DZ')} كيس
• الرمل: ${project.sand.toLocaleString('ar-DZ', { maximumFractionDigits: 1 })} م³
• الحديد: ${project.steel.toLocaleString('ar-DZ')} كغ
• الحصى: ${project.gravel.toLocaleString('ar-DZ', { maximumFractionDigits: 1 })} م³

💰 التكلفة الإجمالية: ${project.finalCost.toLocaleString('ar-DZ')} د.ج

تم الحساب بواسطة حاسبة مواد البناء
  `.trim();

  try {
    if (navigator.share) {
      await navigator.share({
        title: `مشروع ${project.name}`,
        text: shareText
      });
      return true;
    } else {
      await navigator.clipboard.writeText(shareText);
      return 'copied';
    }
  } catch (error) {
    console.error('خطأ في المشاركة:', error);
    return false;
  }
};