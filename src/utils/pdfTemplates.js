// utils/pdfTemplates.js
// Plantillas HTML para PDF del curso — I.E. Fidelina Echeverry · Puerto Tejada, Cauca

import { getTipsForManual } from "./iaTips";

export const buildManualHtml = (lessons, { qrDataUri } = {}) => {
  const renderList = (items = []) => {
    if (!items?.length) return "";
    return `<ul class="list">${items.map((t) => `<li>${t}</li>`).join("")}</ul>`;
  };

  const renderParagraphs = (paragraphs = []) => {
    if (!paragraphs?.length) return "";
    return paragraphs.map((p) => `<p class="p">${p}</p>`).join("");
  };

  const renderModule = (module, index) => {
    const tips = getTipsForManual(module.id);

    return `
      <section class="page-break module">
        <div class="moduleHeader">
          <div class="moduleKicker">MÓDULO ${index + 1}</div>
          <h2 class="h2">${module.title}</h2>
          <div class="sub">${module.subtitle || ""}</div>
          <div class="meta">
            <span class="pill">Nivel: ${module.level || "—"}</span>
            <span class="pill">Duración: ${module.duration || "—"}</span>
          </div>
        </div>

        ${
          module.topics?.length
            ? `<div class="card">
                 <div class="cardTitle">¿Qué aprenderás?</div>
                 ${renderList(module.topics)}
               </div>`
            : ""
        }

        <div class="card">
          <div class="cardTitle">Microlecciones</div>
          ${renderParagraphs(module.content?.paragraphs || [])}
        </div>

        <div class="card">
          <div class="cardTitle">Práctica local</div>
          <div class="grid2">
            <div>
              <div class="label">Problema</div>
              <div class="box">${module.localChallenge?.problem || "Caso local"}</div>
            </div>
            <div>
              <div class="label">Prompt base (mal hecho)</div>
              <div class="box code">${module.localChallenge?.badPrompt || "Prompt básico"}</div>
            </div>
          </div>
        </div>

        ${
          tips?.length
            ? `<div class="card tips">
                 <div class="cardTitle">Tips rápidos</div>
                 ${renderList(tips)}
               </div>`
            : ""
        }
      </section>
    `;
  };

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
          :root {
            --blue: #193CB8;
            --red: #D32F2F;
            --green: #2E7D32;
            --ink: #0f172a;
            --muted: #475569;
            --line: #e5e7eb;
            --bg: #f8fafc;
          }
          * { box-sizing: border-box; }
          body { font-family: Arial, sans-serif; color: var(--ink); margin: 0; }
          .page { padding: 0; }
          .page-break { page-break-before: always; }
          .page-break:first-of-type { page-break-before: auto; }

          .cover {
            padding: 18mm 16mm;
            background: var(--bg);
          }
          .brand { color: var(--blue); font-weight: 800; letter-spacing: 0.6px; font-size: 12px; }
          .h1 { color: var(--ink); margin: 10px 0 6px; font-size: 28px; }
          .lead { color: var(--muted); font-size: 14px; line-height: 1.6; max-width: 740px; }
          .toc { margin-top: 14px; }
          .tocTitle { font-weight: 800; color: var(--red); margin: 0 0 8px; }
          .tocItem { padding: 8px 10px; border: 1px solid var(--line); border-radius: 12px; margin-top: 8px; background: #fff; }
          .tocItem b { color: var(--ink); }
          .tocItem small { color: var(--muted); display: block; margin-top: 2px; }

          .qr { display:flex; gap:14px; align-items:center; margin-top: 14px; padding: 12px; border: 1px dashed var(--line); border-radius: 14px; background: #fff; }
          .qr img { width: 110px; height: 110px; }
          .qrTitle { margin: 0; color: var(--ink); font-size: 14px; font-weight: 800; }
          .qrSub { margin: 4px 0 0; color: var(--muted); font-size: 12px; }

          .module { padding: 18mm 16mm; }
          .moduleHeader { padding: 14px; border: 1px solid var(--line); border-radius: 16px; background: #fff; }
          .moduleKicker { color: var(--blue); font-weight: 900; font-size: 12px; letter-spacing: 0.8px; }
          .h2 { margin: 8px 0 4px; font-size: 20px; color: var(--ink); }
          .sub { color: var(--muted); font-size: 13px; line-height: 1.4; }
          .meta { margin-top: 10px; display:flex; gap: 8px; flex-wrap: wrap; }
          .pill { display:inline-block; border: 1px solid var(--line); border-radius: 999px; padding: 6px 10px; font-size: 12px; color: var(--muted); background: #fff; }

          .card { border: 1px solid var(--line); border-radius: 16px; padding: 14px; margin-top: 12px; background: #fff; page-break-inside: avoid; }
          .cardTitle { font-weight: 900; color: var(--red); margin-bottom: 10px; font-size: 14px; }
          .p { margin: 0 0 10px; color: var(--ink); font-size: 13px; line-height: 1.7; }
          .p:last-child { margin-bottom: 0; }
          .list { margin: 0; padding-left: 18px; }
          .list li { margin: 6px 0; color: var(--ink); font-size: 13px; line-height: 1.6; }
          .grid2 { display: flex; gap: 12px; flex-wrap: wrap; }
          .grid2 > div { flex: 1; min-width: 220px; }
          .label { font-size: 12px; font-weight: 800; color: var(--muted); margin-bottom: 6px; }
          .box { border: 1px solid var(--line); border-radius: 12px; padding: 10px; background: #fff; color: var(--ink); font-size: 13px; line-height: 1.6; }
          .code { font-family: "Courier New", monospace; }
          .tips { border-left: 5px solid var(--green); }
        </style>
      </head>
      <body>
        <section class="cover">
          <div class="brand">I.E. FIDELINA ECHEVERRY · PUERTO TEJADA (CAUCA)</div>
          <div class="h1">Manual del curso IA Learning</div>
          <div class="lead">
            Guía imprimible del curso con lecturas resumidas y prácticas locales. Este PDF está diseñado
            para repasar en casa o cuando no tengas conexión.
          </div>

          ${
            qrDataUri
              ? `<div class="qr">
                   <img src="${qrDataUri}" />
                   <div>
                     <p class="qrTitle">Acceso rápido</p>
                     <p class="qrSub">Escanea para acceder al material en línea.</p>
                   </div>
                 </div>`
              : ""
          }

          <div class="toc">
            <div class="tocTitle">Contenido</div>
            ${lessons
              .map(
                (m, idx) => `
                  <div class="tocItem">
                    <b>Módulo ${idx + 1}:</b> ${m.title}
                    <small>${m.subtitle || ""}</small>
                  </div>
                `,
              )
              .join("")}
          </div>

          <div class="toc">
            <div class="tocTitle">Cómo funciona el curso (paso a paso)</div>
            <div class="tocItem">
              <b>1) Lee las microlecciones</b>
              <small>Empieza por “Microlecciones” en cada módulo para entender el tema con ejemplos claros.</small>
            </div>
            <div class="tocItem">
              <b>2) Realiza la práctica local</b>
              <small>Usa el “Problema” del municipio y mejora el “Prompt base (mal hecho)” con tus propias palabras.</small>
            </div>
            <div class="tocItem">
              <b>3) Completa las actividades del módulo</b>
              <small>En el HUB del módulo marca PDF leído, video visto, ejercicio y desafío guardado.</small>
            </div>
            <div class="tocItem">
              <b>4) Finaliza y avanza</b>
              <small>Al completar las actividades, finaliza el módulo para avanzar al siguiente y acumular progreso.</small>
            </div>
            <div class="tocItem">
              <b>5) Certificación</b>
              <small>Al completar los módulos requeridos, se habilita el certificado final del curso.</small>
            </div>
          </div>
        </section>

        ${lessons.map((m, idx) => renderModule(m, idx)).join("")}
      </body>
    </html>
  `;
};

export const buildModulePdfHtml = (lesson) => {
  const renderList = (items = []) => {
    if (!items?.length) return "";
    return `<ul class="list">${items.map((t) => `<li>${t}</li>`).join("")}</ul>`;
  };

  const renderParagraphs = (paragraphs = []) => {
    if (!paragraphs?.length) return "";
    return paragraphs.map((p) => `<p class="p">${p}</p>`).join("");
  };

  const tips = getTipsForManual(lesson.id);

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
          :root {
            --blue: #193CB8;
            --red: #D32F2F;
            --green: #2E7D32;
            --ink: #0f172a;
            --muted: #475569;
            --line: #e5e7eb;
            --bg: #f8fafc;
          }
          * { box-sizing: border-box; }
          body { font-family: Arial, sans-serif; color: var(--ink); margin: 0; background: var(--bg); }
          .wrap { padding: 18mm 16mm; }
          .brand { color: var(--blue); font-weight: 900; letter-spacing: 0.8px; font-size: 12px; }
          .h1 { margin: 10px 0 6px; font-size: 26px; color: var(--ink); }
          .sub { margin: 0; color: var(--muted); font-size: 13px; line-height: 1.5; }
          .meta { margin-top: 10px; display:flex; gap: 8px; flex-wrap: wrap; }
          .pill { display:inline-block; border: 1px solid var(--line); border-radius: 999px; padding: 6px 10px; font-size: 12px; color: var(--muted); background: #fff; }
          .card { border: 1px solid var(--line); border-radius: 16px; padding: 14px; margin-top: 12px; background: #fff; page-break-inside: avoid; }
          .cardTitle { font-weight: 900; color: var(--red); margin-bottom: 10px; font-size: 14px; }
          .p { margin: 0 0 10px; color: var(--ink); font-size: 13px; line-height: 1.7; }
          .p:last-child { margin-bottom: 0; }
          .list { margin: 0; padding-left: 18px; }
          .list li { margin: 6px 0; color: var(--ink); font-size: 13px; line-height: 1.6; }
          .grid2 { display: flex; gap: 12px; flex-wrap: wrap; }
          .grid2 > div { flex: 1; min-width: 220px; }
          .label { font-size: 12px; font-weight: 800; color: var(--muted); margin-bottom: 6px; }
          .box { border: 1px solid var(--line); border-radius: 12px; padding: 10px; background: #fff; color: var(--ink); font-size: 13px; line-height: 1.6; }
          .code { font-family: "Courier New", monospace; }
          .tips { border-left: 5px solid var(--green); }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="brand">IA LEARNING · MÓDULO ${lesson.id}</div>
          <div class="h1">${lesson.title}</div>
          <p class="sub">${lesson.subtitle || ""}</p>

          <div class="meta">
            <span class="pill">Nivel: ${lesson.level || "—"}</span>
            <span class="pill">Duración: ${lesson.duration || "—"}</span>
          </div>

          ${
            lesson.topics?.length
              ? `<div class="card">
                   <div class="cardTitle">¿Qué aprenderás?</div>
                   ${renderList(lesson.topics)}
                 </div>`
              : ""
          }

          <div class="card">
            <div class="cardTitle">Microlecciones</div>
            ${renderParagraphs(lesson.content?.paragraphs || [])}
          </div>

          <div class="card">
            <div class="cardTitle">Práctica local</div>
            <div class="grid2">
              <div>
                <div class="label">Problema</div>
                <div class="box">${lesson.localChallenge?.problem || "Caso local"}</div>
              </div>
              <div>
                <div class="label">Prompt base (mal hecho)</div>
                <div class="box code">${lesson.localChallenge?.badPrompt || "Prompt básico"}</div>
              </div>
            </div>
          </div>

          ${
            tips?.length
              ? `<div class="card tips">
                   <div class="cardTitle">Tips rápidos</div>
                   ${renderList(tips)}
                 </div>`
              : ""
          }
        </div>
      </body>
    </html>
  `;
};

export const buildFinalCertificateHtml = ({
  studentName,
  completedCount,
  qrDataUri,
  uuid,
}) => {
  const year = new Date().getFullYear();
  const code = uuid || `PT-IA-${year}-${Date.now()}`;

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          @page { size: A4 landscape; margin: 18mm; }
          body { font-family: Georgia, serif; background: #f8fafc; padding: 0; }
          .certificate {
            border: 12px solid #C62828;
            border-radius: 22px;
            padding: 28px;
            background:
              radial-gradient(circle at 15% 20%, rgba(198,40,40,0.10), transparent 45%),
              radial-gradient(circle at 85% 70%, rgba(46,125,50,0.12), transparent 50%),
              linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
            text-align: center;
            position: relative;
          }
          .brand { color: #193CB8; letter-spacing: 1px; font-weight: bold; }
          h1 { margin: 16px 0 8px; color: #0f172a; font-size: 34px; }
          .subtitle { color: #334155; margin-bottom: 10px; }
          .name {
            margin: 20px 0;
            font-size: 30px;
            color: #111827;
            border-bottom: 3px solid #2E7D32;
            display: inline-block;
            padding: 0 14px 8px;
          }
          .module { color: #2E7D32; font-weight: bold; margin-top: 14px; }
          .code { margin-top: 14px; color: #475569; font-size: 13px; }
          .seal { margin-top: 16px; color: #C62828; font-weight: bold; }
          .qr {
            position: absolute;
            right: 22px;
            bottom: 20px;
            width: 140px;
            text-align: center;
          }
          .qr img { width: 120px; height: 120px; }
          .qr small { display:block; margin-top:6px; color:#334155; font-size:11px; }
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
          <div class="code">Codigo de verificacion: ${code}</div>
          <div class="seal">ODS 4 · Educacion de Calidad</div>
          ${
            qrDataUri
              ? `<div class="qr">
                   <img src="${qrDataUri}" />
                   <small>Escanea para acceder</small>
                 </div>`
              : ""
          }
        </div>
      </body>
    </html>
  `;
};
