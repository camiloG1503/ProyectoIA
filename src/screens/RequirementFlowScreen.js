import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Platform,
    Linking,
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as Speech from "expo-speech";

import { useAuth } from "../context/AuthContext";
import { COLORS, PUERTO_TEJADA } from "../utils/colors";
import { lessonsData } from "../utils/lessonsData";
import { loadProgress, saveLessonProgress } from "../utils/storage";

const diagnosticQuestions = [
    {
        question: "Antes de este modulo, ¿como describirias tu nivel de uso de IA?",
        options: ["Nunca la he usado", "La uso algunas veces", "La uso con frecuencia"],
    },
    {
        question: "¿Para que usas mas la IA actualmente?",
        options: ["Estudio y tareas", "Ideas de proyectos", "Curiosidad o entretenimiento"],
    },
    {
        question: "¿Que tan seguido verificas si la respuesta de IA es correcta?",
        options: ["Siempre", "A veces", "Casi nunca"],
    },
    {
        question: "¿Sueles dar contexto local (curso, edad, municipio) cuando escribes prompts?",
        options: ["Si", "A veces", "No"],
    },
    {
        question: "Despues de este modulo, ¿que quieres mejorar primero?",
        options: ["Escribir mejores prompts", "Evaluar respuestas", "Usarla con etica"],
    },
];

const promptChecks = [
    {
        key: "role",
        label: "Rol",
        test: (text) => /eres|actua como|actua|rol/i.test(text),
        hint: "Agrega quien responde, por ejemplo: Actua como tutor escolar.",
    },
    {
        key: "task",
        label: "Tarea",
        test: (text) => /explica|resume|crea|genera|analiza|redacta|propone|disena|disena/i.test(text),
        hint: "Define una tarea concreta: explicar, redactar, analizar, proponer.",
    },
    {
        key: "context",
        label: "Contexto",
        test: (text) => /puerto tejada|cauca|estudiante|grado|colegio|municipio|barrio|feria/i.test(text),
        hint: "Incluye contexto local o academico (Puerto Tejada, grado, materia, etc.).",
    },
    {
        key: "format",
        label: "Formato",
        test: (text) => /lista|tabla|pasos|puntos|formato|maximo|maximo|bloques|titulo/i.test(text),
        hint: "Pide un formato de salida: lista, tabla, pasos o bloques.",
    },
];

const RequirementFlowScreen = ({ route, navigation }) => {
    const { lesson } = route.params;
    const { user } = useAuth();

    const [manualStatus, setManualStatus] = useState("");
    const [readingActive, setReadingActive] = useState(false);
    const [diagnosticAnswers, setDiagnosticAnswers] = useState({});
    const [diagnosticStatus, setDiagnosticStatus] = useState("");
    const [promptText, setPromptText] = useState("");
    const [promptFeedback, setPromptFeedback] = useState("");
    const [completedLessons, setCompletedLessons] = useState([]);
    const [certificateStatus, setCertificateStatus] = useState("");
    const [previewImageError, setPreviewImageError] = useState(false);

    const certificateCode = useMemo(() => {
        return `PT-IA-M${String(lesson.id).padStart(2, "0")}-${new Date().getFullYear()}`;
    }, [lesson.id]);

    const certificatePreviewUri = useMemo(() => {
        const title = encodeURIComponent("Certificado ProyectIA");
        return `https://dummyimage.com/1280x720/f8fafc/0f172a&text=${title}`;
    }, []);

    useEffect(() => {
        const syncProgress = async () => {
            const stored = await loadProgress();
            setCompletedLessons(stored?.completedLessons || []);
        };

        syncProgress();
    }, []);

    const isModuleCompleted = completedLessons.includes(lesson.id);

    const finishLesson = async (showCompletion = true) => {
        const newData = await saveLessonProgress(lesson.id);
        setCompletedLessons(newData.completedLessons || []);

        if (showCompletion) {
            navigation.navigate("Completed", { lesson });
        }
    };

    const sharePdf = async (html, fileName, statusMessage, setStatus) => {
        try {
            if (Platform.OS === "web") {
                await Print.printAsync({ html });
                setStatus(statusMessage);
                return;
            }

            const result = await Print.printToFileAsync({ html });
            if (result?.uri) {
                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(result.uri, {
                        mimeType: "application/pdf",
                        dialogTitle: fileName,
                    });
                } else {
                    await Linking.openURL(result.uri);
                }
            }
            setStatus(statusMessage);
        } catch (error) {
            console.log("PDF error:", error);
            Alert.alert("No se pudo generar el PDF", "Intenta nuevamente.");
        }
    };

    const handleManualDownload = () => {
        const html = `
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
          <h1>Manual del curso ProyectIA</h1>
          <p>Guia del curso con instrucciones de uso y lecturas de cada seccion para estudiantes de Puerto Tejada.</p>

          <div class="card">
            <h2>Como usar el curso</h2>
            <ul>
              <li>Lee primero las microlecciones de cada modulo.</li>
              <li>Responde el diagnostico inicial para reconocer tu punto de partida.</li>
              <li>Mejora un prompt mal hecho basado en una situacion local del municipio.</li>
              <li>Marca el modulo como completado para habilitar su certificado descargable.</li>
            </ul>
          </div>

          ${lessonsData
                .map((module) => {
                    const paragraphs = (module.content?.paragraphs || [])
                        .map((p) => `<p>${p}</p>`)
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
                .join("")}

          <div class="card">
            <h2>Nota final</h2>
            <p>Este manual resume las lecturas y dinamicas del prototipo para facilitar el uso dentro y fuera del aula.</p>
          </div>
        </body>
      </html>
    `;

        sharePdf(html, "Manual del curso ProyectIA", "Manual PDF generado correctamente.", setManualStatus);
    };

    const handleCertificatePdf = () => {
        if (!isModuleCompleted) {
            Alert.alert(
                "Certificado bloqueado",
                "Primero debes completar este modulo para habilitar la descarga del certificado."
            );
            return;
        }

        const studentName = user?.name || "Estudiante de prueba";
        const html = `
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
            <h1>CERTIFICADO</h1>
            <div class="subtitle">Reconocimiento de competencia en prompts y uso responsable de IA</div>
            <div>Se certifica a</div>
            <div class="name">${studentName}</div>
            <div class="module">Por completar: ${lesson.title}</div>
            <div class="code">Codigo de verificacion: ${certificateCode}</div>
            <div class="seal">ODS 4 · Educacion de Calidad</div>
          </div>
        </body>
      </html>
    `;

        sharePdf(
            html,
            `Certificado ${lesson.title}`,
            "Certificado PDF generado y listo para descargar.",
            setCertificateStatus
        );
    };

    const handleSpeech = () => {
        if (readingActive) {
            Speech.stop();
            setReadingActive(false);
            return;
        }

        const readingText = lesson.content?.paragraphs?.join(" ") || lesson.description;
        Speech.speak(readingText, {
            language: "es-CO",
            rate: 0.95,
            onDone: () => setReadingActive(false),
            onStopped: () => setReadingActive(false),
            onError: () => setReadingActive(false),
        });
        setReadingActive(true);
    };

    const handleDiagnosticSelect = (questionIndex, option) => {
        setDiagnosticAnswers((prev) => ({
            ...prev,
            [questionIndex]: option,
        }));
    };

    const handleDiagnosticSubmit = () => {
        const answeredCount = Object.keys(diagnosticAnswers).length;
        if (answeredCount < diagnosticQuestions.length) {
            setDiagnosticStatus("Responde todas las preguntas para guardar tu diagnostico inicial.");
            return;
        }

        const summary = `Diagnostico registrado: ${answeredCount} respuestas. Punto de partida identificado para ${lesson.title}.`;
        setDiagnosticStatus(summary);
    };

    const handlePromptCheck = () => {
        const text = promptText.trim();
        if (!text) {
            setPromptFeedback("Escribe una version mejorada del prompt para recibir retroalimentacion.");
            return;
        }

        const missing = promptChecks.filter((check) => !check.test(text));
        if (missing.length === 0) {
            setPromptFeedback(
                "Excelente: tu prompt tiene rol, tarea, contexto y formato. Ya es apto para obtener respuestas mas utiles."
            );
            return;
        }

        const hints = missing.map((item) => item.hint).join(" ");
        setPromptFeedback(`Vas bien, pero falta ajustar: ${hints}`);
    };

    return (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.hero, { backgroundColor: lesson.color }]}>
                    <MaterialIcons name={lesson.icon} size={48} color="#fff" />
                    <Text style={styles.heroTitle}>{lesson.title}</Text>
                    <Text style={styles.heroSubtitle}>{lesson.subtitle}</Text>
                    <View style={styles.heroBadge}>
                        <Text style={styles.heroBadgeText}>{lesson.level}</Text>
                    </View>
                </View>

                <View style={styles.metaRow}>
                    <View style={styles.metaChip}>
                        <Text style={styles.metaChipText}>{lesson.duration}</Text>
                    </View>
                    <View style={styles.metaChip}>
                        <Text style={styles.metaChipText}>{lesson.level}</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Microlecciones</Text>
                    {(lesson.content?.paragraphs || []).map((paragraph, index) => (
                        <Text key={`${lesson.id}-${index}`} style={styles.paragraphText}>
                            {paragraph}
                        </Text>
                    ))}
                    <TouchableOpacity style={styles.primaryButton} onPress={handleSpeech}>
                        <MaterialIcons name={readingActive ? "stop" : "volume-up"} size={20} color="#fff" />
                        <Text style={styles.primaryButtonText}>{readingActive ? "Detener lectura" : "Escuchar lectura"}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Diagnostico inicial</Text>
                    <Text style={styles.bodyText}>
                        Este cuestionario recoge como entiendes y usas la IA actualmente. No se califica; sirve para personalizar tu proceso.
                    </Text>

                    {diagnosticQuestions.map((item, questionIndex) => (
                        <View key={item.question} style={styles.quizBlock}>
                            <Text style={styles.questionText}>{item.question}</Text>
                            <View style={styles.optionList}>
                                {item.options.map((option) => {
                                    const isSelected = diagnosticAnswers[questionIndex] === option;
                                    return (
                                        <TouchableOpacity
                                            key={`${item.question}-${option}`}
                                            style={[styles.optionButton, isSelected && styles.optionSelected]}
                                            onPress={() => handleDiagnosticSelect(questionIndex, option)}
                                        >
                                            <Text style={styles.optionText}>{option}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.primaryButton} onPress={handleDiagnosticSubmit}>
                        <MaterialIcons name="assignment-turned-in" size={20} color="#fff" />
                        <Text style={styles.primaryButtonText}>Guardar diagnostico</Text>
                    </TouchableOpacity>
                    {!!diagnosticStatus && <Text style={styles.statusText}>{diagnosticStatus}</Text>}
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Caso practico de Puerto Tejada</Text>
                    <View style={styles.tipBox}>
                        <Text style={styles.tipLabel}>Problema local</Text>
                        <Text style={styles.tipText}>{lesson.localChallenge?.problem}</Text>
                    </View>

                    <View style={styles.promptBox}>
                        <Text style={styles.promptLabel}>Prompt mal hecho</Text>
                        <Text style={styles.promptOriginal}>{lesson.localChallenge?.badPrompt}</Text>
                    </View>

                    <Text style={styles.bodyText}>
                        Mejora el prompt para que incluya rol, tarea, contexto local y formato de respuesta.
                    </Text>

                    <TextInput
                        style={styles.promptInput}
                        placeholder="Escribe aqui tu prompt mejorado"
                        placeholderTextColor="#9CA3AF"
                        multiline
                        value={promptText}
                        onChangeText={setPromptText}
                    />

                    <TouchableOpacity style={styles.primaryButton} onPress={handlePromptCheck}>
                        <MaterialIcons name="fact-check" size={20} color="#fff" />
                        <Text style={styles.primaryButtonText}>Evaluar mejora</Text>
                    </TouchableOpacity>
                    {!!promptFeedback && <Text style={styles.statusText}>{promptFeedback}</Text>}
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Manual del curso en PDF</Text>
                    <Text style={styles.bodyText}>
                        Descarga un manual con instrucciones de uso del curso y las lecturas resumidas de cada seccion.
                    </Text>
                    <TouchableOpacity style={styles.primaryButton} onPress={handleManualDownload}>
                        <MaterialIcons name="picture-as-pdf" size={20} color="#fff" />
                        <Text style={styles.primaryButtonText}>Descargar manual PDF</Text>
                    </TouchableOpacity>
                    {!!manualStatus && <Text style={styles.statusText}>{manualStatus}</Text>}
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Insignia y certificado</Text>
                    <Text style={styles.bodyText}>
                        El certificado de este modulo solo se habilita cuando lo marcas como completado. Es un prototipo con nombre de prueba.
                    </Text>

                    <View style={styles.previewCard}>
                        {!previewImageError ? (
                            <Image
                                source={{ uri: certificatePreviewUri }}
                                style={styles.previewImage}
                                resizeMode="cover"
                                onError={() => setPreviewImageError(true)}
                            />
                        ) : (
                            <View style={styles.previewFallback}>
                                <MaterialIcons name="image" size={44} color={COLORS.primary} />
                                <Text style={styles.previewFallbackText}>Vista previa de certificado</Text>
                            </View>
                        )}
                        <View style={styles.previewOverlay}>
                            <Text style={styles.previewTitle}>CERTIFICADO PROTOTIPO</Text>
                            <Text style={styles.previewName}>{user?.name || "Estudiante de prueba"}</Text>
                            <Text style={styles.previewModule}>{lesson.title}</Text>
                            <Text style={styles.previewCode}>{certificateCode}</Text>
                        </View>
                    </View>

                    {!isModuleCompleted ? (
                        <TouchableOpacity style={styles.primaryButton} onPress={() => finishLesson(false)}>
                            <MaterialIcons name="task-alt" size={20} color="#fff" />
                            <Text style={styles.primaryButtonText}>Marcar modulo como completado</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.completedPill}>
                            <MaterialIcons name="verified" size={18} color="#fff" />
                            <Text style={styles.completedPillText}>Modulo completado. Certificado habilitado.</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.primaryButton, !isModuleCompleted && styles.disabledButton]}
                        onPress={handleCertificatePdf}
                        disabled={!isModuleCompleted}
                    >
                        <MaterialIcons name="download" size={20} color="#fff" />
                        <Text style={styles.primaryButtonText}>Descargar certificado PDF</Text>
                    </TouchableOpacity>
                    {!!certificateStatus && <Text style={styles.statusText}>{certificateStatus}</Text>}
                </View>

                <TouchableOpacity style={styles.secondaryButton} onPress={() => finishLesson(true)}>
                    <Text style={styles.secondaryButtonText}>Finalizar modulo</Text>
                </TouchableOpacity>

                <View style={{ height: 24 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
        gap: 14,
    },
    hero: {
        borderRadius: 24,
        padding: 22,
        alignItems: "center",
    },
    heroTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
    },
    heroSubtitle: {
        color: "rgba(255,255,255,0.92)",
        fontSize: 15,
        textAlign: "center",
        marginTop: 6,
    },
    heroBadge: {
        marginTop: 12,
        backgroundColor: "rgba(255,255,255,0.18)",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 999,
    },
    heroBadgeText: {
        color: "#fff",
        fontWeight: "600",
    },
    metaRow: {
        flexDirection: "row",
        gap: 10,
    },
    metaChip: {
        backgroundColor: "#fff",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    metaChipText: {
        color: COLORS.text,
        fontWeight: "600",
        fontSize: 12,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 18,
        gap: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    bodyText: {
        fontSize: 15,
        lineHeight: 23,
        color: COLORS.textLight,
    },
    paragraphText: {
        fontSize: 15,
        lineHeight: 24,
        color: COLORS.text,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        minHeight: 50,
        paddingHorizontal: 16,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
    },
    disabledButton: {
        backgroundColor: "#94A3B8",
    },
    secondaryButton: {
        borderRadius: 16,
        minHeight: 48,
        paddingHorizontal: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.primary,
        backgroundColor: "#fff",
    },
    secondaryButtonText: {
        color: COLORS.primary,
        fontWeight: "700",
        fontSize: 15,
    },
    primaryButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },
    statusText: {
        color: COLORS.text,
        fontSize: 14,
        lineHeight: 20,
    },
    quizBlock: {
        gap: 8,
        paddingVertical: 6,
    },
    questionText: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.text,
    },
    optionList: {
        gap: 8,
    },
    optionButton: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        padding: 12,
        backgroundColor: "#fff",
    },
    optionSelected: {
        borderColor: COLORS.puertoTejadaGreen,
        backgroundColor: "#ECFDF5",
    },
    optionText: {
        color: COLORS.text,
        fontWeight: "600",
    },
    tipBox: {
        backgroundColor: "#EEF2FF",
        borderRadius: 18,
        padding: 14,
        gap: 4,
    },
    tipLabel: {
        color: COLORS.primary,
        fontWeight: "700",
    },
    tipText: {
        color: COLORS.text,
        lineHeight: 22,
    },
    promptBox: {
        backgroundColor: "#F3F4F6",
        borderRadius: 16,
        padding: 14,
    },
    promptLabel: {
        color: COLORS.textLight,
        fontWeight: "700",
        marginBottom: 6,
    },
    promptOriginal: {
        color: COLORS.text,
        fontStyle: "italic",
    },
    promptInput: {
        minHeight: 120,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        padding: 14,
        textAlignVertical: "top",
        color: COLORS.text,
        backgroundColor: "#fff",
    },
    previewCard: {
        borderRadius: 18,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#CFE8E7",
        backgroundColor: "#ECFEFF",
    },
    previewImage: {
        width: "100%",
        height: 160,
        opacity: 0.65,
    },
    previewFallback: {
        width: "100%",
        height: 160,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ECFEFF",
        gap: 8,
    },
    previewFallbackText: {
        color: COLORS.primary,
        fontWeight: "700",
    },
    previewOverlay: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        gap: 3,
    },
    previewTitle: {
        color: "#0F172A",
        fontWeight: "800",
        fontSize: 16,
        letterSpacing: 0.8,
    },
    previewName: {
        color: "#111827",
        fontSize: 18,
        fontWeight: "700",
    },
    previewModule: {
        color: "#0F766E",
        fontWeight: "700",
        textAlign: "center",
    },
    previewCode: {
        color: "#475569",
        fontSize: 12,
        marginTop: 2,
    },
    completedPill: {
        minHeight: 44,
        borderRadius: 999,
        backgroundColor: COLORS.puertoTejadaGreen,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    completedPillText: {
        color: "#fff",
        fontWeight: "700",
    },
});

export default RequirementFlowScreen;
