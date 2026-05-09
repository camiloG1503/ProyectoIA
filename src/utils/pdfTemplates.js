// utils/pdfTemplates.js
// Plantillas HTML para PDF del curso — I.E. Fidelina Echeverry · Puerto Tejada, Cauca

export const buildManualHtml = (lessons) => {
  const modulesHtml = lessons
    .map((module) => {
      const paragraphs = (module.content?.paragraphs || [])
        .map((paragraph) => `<p>${paragraph}</p>`)
        .join("");

      return `
        <div class="card">
          <h2>${module.title}</h2>
          <h3>${module.subtitle}</h3>
          <p><strong>Lectura:</strong></p>
          ${paragraphs}
          <p><strong>Practica:</strong> ${module.localChallenge?.problem || "Caso local"}</p>
          <p><strong>Prompt mal hecho:</strong> ${module.localChallenge?.badPrompt || "Prompt basico"}</p>
        </div>
      `;
    })
    .join("");

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 28px; color: #1f2937; }
          h1 { color: #193CB8; margin-bottom: 8px; }
          h2 { color: #D32F2F; margin-top: 22px; }
          h3 { color: #0f172a; margin-top: 16px; }
          p, li { line-height: 1.6; font-size: 14px; }
          .card { border: 1px solid #e5e7eb; border-radius: 14px; padding: 14px; margin-top: 12px; }
        </style>
      </head>
      <body>
        <h1>Manual del curso IA Learning</h1>
        <p>Guia del curso con instrucciones de uso y lecturas de cada seccion para estudiantes de Puerto Tejada.</p>

        <div class="card">
          <h2>Como usar el curso</h2>
          <ul>
            <li>Lee primero las microlecciones de cada modulo.</li>
            <li>Responde el diagnostico inicial para reconocer tu punto de partida.</li>
            <li>Mejora un prompt mal hecho basado en una situacion local del municipio.</li>
            <li>Marca cada modulo como completado para habilitar el certificado final.</li>
          </ul>
        </div>

        ${modulesHtml}

        <div class="card">
          <h2>Nota final</h2>
          <p>Este manual resume las lecturas y dinamicas del prototipo para facilitar el uso dentro y fuera del aula.</p>
        </div>
      </body>
    </html>
  `;
};

export const buildModulePdfHtml = (lesson) => {
  const paragraphs = (lesson.content?.paragraphs || [])
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 28px; color: #1f2937; }
          h1 { color: #193CB8; margin-bottom: 8px; }
          h2 { color: #D32F2F; margin-top: 22px; }
          p, li { line-height: 1.6; font-size: 14px; }
          .card { border: 1px solid #e5e7eb; border-radius: 14px; padding: 14px; margin-top: 12px; }
        </style>
      </head>
      <body>
        <h1>${lesson.title}</h1>
        <p>${lesson.subtitle}</p>

        <div class="card">
          <h2>Microlecciones</h2>
          ${paragraphs}
        </div>

        <div class="card">
          <h2>Practica local</h2>
          <p><strong>Problema:</strong> ${lesson.localChallenge?.problem || "Caso local"}</p>
          <p><strong>Prompt base:</strong> ${lesson.localChallenge?.badPrompt || "Prompt basico"}</p>
        </div>
      </body>
    </html>
  `;
};

export const buildFinalCertificateHtml = ({ studentName, completedCount }) => {
  const year = new Date().getFullYear();

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Georgia, serif; background: #f8fafc; padding: 26px; }
          .certificate {
            border: 10px solid #0f766e;
            border-radius: 20px;
            padding: 30px;
            background: linear-gradient(180deg, #ffffff 0%, #ecfeff 100%);
            text-align: center;
          }
          .brand { color: #193CB8; letter-spacing: 1px; font-weight: bold; }
          h1 { margin: 16px 0 8px; color: #0f172a; font-size: 34px; }
          .subtitle { color: #334155; margin-bottom: 10px; }
          .name {
            margin: 20px 0;
            font-size: 30px;
            color: #111827;
            border-bottom: 2px solid #14B8A6;
            display: inline-block;
            padding: 0 14px 8px;
          }
          .module { color: #0f766e; font-weight: bold; margin-top: 14px; }
          .code { margin-top: 14px; color: #475569; font-size: 13px; }
          .seal { margin-top: 16px; color: #D32F2F; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="brand">I.E. FIDELINA ECHEVERRY · PUERTO TEJADA</div>
          <h1>CERTIFICADO FINAL</h1>
          <div class="subtitle">Reconocimiento por completar el curso de IA Learning</div>
          <div>Se certifica a</div>
          <div class="name">${studentName}</div>
          <div class="module">Por completar ${completedCount} modulos del curso</div>
          <div class="code">Codigo de verificacion: PT-IA-${year}</div>
          <div class="seal">ODS 4 · Educacion de Calidad</div>
        </div>
      </body>
    </html>
  `;
};
