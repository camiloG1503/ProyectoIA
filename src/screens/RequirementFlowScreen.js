import React, { useMemo, useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as Speech from "expo-speech";
import QRCode from "react-native-qrcode-svg";

import { COLORS, PUERTO_TEJADA } from "../utils/colors";
import { saveLessonProgress } from "../utils/storage";

const diagnosticQuestions = [
    {
        question: "¿Usas IA para copiar tareas de sociales?",
        options: ["Nunca", "A veces", "Sí, seguido"],
        correct: 0,
    },
    {
        question: "¿Revisas si la respuesta de la IA es correcta antes de entregarla?",
        options: ["Siempre", "A veces", "Casi nunca"],
        correct: 0,
    },
    {
        question: "¿Le pides a la IA que explique temas con ejemplos de tu contexto?",
        options: ["Sí", "No", "A veces"],
        correct: 0,
    },
    {
        question: "¿Has pedido a la IA que te haga resúmenes o preguntas de práctica?",
        options: ["Sí", "No", "Todavía no"],
        correct: 0,
    },
    {
        question: "¿Cuidas los datos personales cuando usas herramientas de IA?",
        options: ["Sí", "No", "No estoy seguro"],
        correct: 0,
    },
];

const promptChecks = [
    {
        key: "role",
        label: "Rol",
        test: (text) => /eres|actua como|actúa como|rol/i.test(text),
        hint: "Agrega quién debe responder, por ejemplo: 'Actúa como profesor'.",
    },
    {
        key: "task",
        label: "Tarea",
        test: (text) => /explica|resume|crea|genera|analiza|ayudame|ayúdame|haz/i.test(text),
        hint: "Di qué quieres que haga la IA con claridad.",
    },
    {
        key: "context",
        label: "Contexto",
        test: (text) => /materia|curso|tema|para|estudiante|edad|nivel|contexto/i.test(text),
        hint: "Agrega para qué es y a quién va dirigido.",
    },
    {
        key: "format",
        label: "Formato",
        test: (text) => /lista|tabla|pasos|puntos|formato|respuestas|bloques/i.test(text),
        hint: "Indica cómo quieres la respuesta: lista, tabla, pasos, etc.",
    },
];

const RequirementFlowScreen = ({ route, navigation }) => {
    const { lesson } = route.params;
    const stepType = lesson.stepType || "entry";

    const [manualStatus, setManualStatus] = useState("");
    const [quizIndex, setQuizIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [quizScore, setQuizScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [readingActive, setReadingActive] = useState(false);
    const [promptText, setPromptText] = useState("");
    const [promptFeedback, setPromptFeedback] = useState("");
    const [certificateStatus, setCertificateStatus] = useState("");

    const manualHtml = useMemo(() => {
        return `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; padding: 28px; color: #1f2937; }
            h1 { color: #193CB8; }
            h2 { color: #D32F2F; margin-top: 24px; }
            p { line-height: 1.6; font-size: 14px; }
            .card { border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; margin-top: 18px; }
          </style>
        </head>
        <body>
          <h1>Manual de uso - ProyectIA Puerto Tejada</h1>
          <p>Guía rápida para ingresar a la app, revisar el curso y completar la unidad 1.</p>
          <div class="card">
            <h2>Paso 1</h2>
            <p>Abre la aplicación desde el celular o computador. La interfaz está diseñada para funcionar en pantallas pequeñas y grandes.</p>
          </div>
          <div class="card">
            <h2>Paso 2</h2>
            <p>Descarga este manual y léelo sin conexión cuando quieras repasar el contenido.</p>
          </div>
          <div class="card">
            <h2>Consejo</h2>
            <p>Usa lenguaje claro, menciona el contexto y pide respuestas en formato ordenado.</p>
          </div>
        </body>
      </html>
    `;
    }, []);

    const certificateCode = useMemo(() => {
        return `PT-IA-${String(lesson.id).padStart(2, "0")}-${new Date().getFullYear()}`;
    }, [lesson.id]);

    const certificateQrValue = useMemo(() => {
        return `ProyectIA|${certificateCode}|${PUERTO_TEJADA.fundacion}`;
    }, [certificateCode]);

    const finishLesson = async () => {
        await saveLessonProgress(lesson.id);
        navigation.navigate("Completed", { lesson });
    };

    const sharePdf = async (html, fileName, statusMessage) => {
        try {
            if (Platform.OS === "web") {
                await Print.printAsync({ html });
                setManualStatus(statusMessage);
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
            setManualStatus(statusMessage);
        } catch (error) {
            console.log("PDF error:", error);
            Alert.alert("No se pudo generar el PDF", "Intenta nuevamente.");
        }
    };

    const handleManualDownload = () => {
        const html = manualHtml;
        sharePdf(html, "Manual PDF ProyectIA", "Manual listo para descargarse o imprimirse.");
    };

    const handleCertificatePdf = () => {
        const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #1f2937; text-align: center; }
            .badge { border: 3px solid #14B8A6; border-radius: 24px; padding: 24px; }
            h1 { color: #193CB8; margin-bottom: 8px; }
            .name { font-size: 22px; font-weight: bold; margin: 12px 0; }
            .code { font-size: 14px; color: #6b7280; margin-bottom: 18px; }
            .qr { margin: 18px auto; width: 180px; height: 180px; }
            p { line-height: 1.6; }
            .seal { margin-top: 20px; color: #D32F2F; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="badge">
            <h1>Insignia digital</h1>
            <div class="name">Prompter crítico - Uso ético de IA</div>
            <div class="code">Código: ${certificateCode}</div>
            <img class="qr" src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(certificateQrValue)}" />
            <p>Este certificado reconoce que el estudiante completó el módulo de uso crítico y ético de IA.</p>
            <div class="seal">ODS 4 - Educación de Calidad</div>
          </div>
        </body>
      </html>
    `;

        sharePdf(html, "Certificado ProyectIA", "Certificado listo con código QR.");
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

    const handleQuizAnswer = (answerIndex) => {
        if (selectedAnswer !== null || quizFinished) {
            return;
        }

        setSelectedAnswer(answerIndex);
        const currentQuestion = diagnosticQuestions[quizIndex];
        const isCorrect = answerIndex === currentQuestion.correct;
        const nextScore = quizScore + (isCorrect ? 1 : 0);
        setQuizScore(nextScore);
    };

    const handleQuizNext = () => {
        if (quizIndex < diagnosticQuestions.length - 1) {
            setQuizIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            return;
        }

        setQuizFinished(true);
    };

    const handlePromptCheck = () => {
        const text = promptText.trim();
        if (!text) {
            setPromptFeedback("Escribe una versión mejorada del prompt para recibir sugerencias.");
            return;
        }

        const missing = promptChecks.filter((check) => !check.test(text));
        if (missing.length === 0) {
            setPromptFeedback(
                "Muy bien. Tu prompt incluye rol, tarea, contexto y formato. Ya se entiende mejor y tiene más posibilidades de dar una respuesta útil."
            );
            return;
        }

        const hints = missing.map((item) => item.hint).join(" ");
        setPromptFeedback(`Vas bien. Todavía falta mejorar: ${hints}`);
    };

    const renderHeader = () => (
        <View style={[styles.hero, { backgroundColor: lesson.color }]}>
            <MaterialIcons name={lesson.icon} size={48} color="#fff" />
            <Text style={styles.heroTitle}>{lesson.title}</Text>
            <Text style={styles.heroSubtitle}>{lesson.subtitle}</Text>
            <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>{lesson.level}</Text>
            </View>
        </View>
    );

    const renderEntryStep = () => (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Paso 1</Text>
            <Text style={styles.bodyText}>
                El estudiante entra a la aplicación desde su celular o computador. La experiencia está pensada para redes lentas y pantallas pequeñas.
            </Text>
            <View style={styles.tipBox}>
                <Text style={styles.tipLabel}>Objetivo</Text>
                <Text style={styles.tipText}>
                    Iniciar el curso sin depender de un equipo potente.
                </Text>
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={finishLesson}>
                <Text style={styles.primaryButtonText}>Ingresé a la app</Text>
            </TouchableOpacity>
        </View>
    );

    const renderManualStep = () => (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Descarga el manual PDF</Text>
            <Text style={styles.bodyText}>
                Genera el manual liviano del curso y compártelo o imprímelo para tener la guía de introducción a la IA.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={handleManualDownload}>
                <MaterialIcons name="picture-as-pdf" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Descargar manual</Text>
            </TouchableOpacity>
            {!!manualStatus && <Text style={styles.statusText}>{manualStatus}</Text>}
            <TouchableOpacity style={styles.secondaryButton} onPress={finishLesson}>
                <Text style={styles.secondaryButtonText}>Seguir al diagnóstico</Text>
            </TouchableOpacity>
        </View>
    );

    const renderDiagnosticStep = () => {
        const currentQuestion = diagnosticQuestions[quizIndex];
        const answerLabel = selectedAnswer === null ? "Responde una opción" : selectedAnswer === currentQuestion.correct ? "Buen paso" : "Sigue intentando";
        return (
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Diagnóstico inicial</Text>
                <Text style={styles.bodyText}>
                    Responde cinco preguntas para identificar cómo usas la IA hoy. No hay castigo: solo queremos saber desde dónde empiezas.
                </Text>
                {!quizFinished ? (
                    <>
                        <View style={styles.quizHeader}>
                            <Text style={styles.quizProgress}>Pregunta {quizIndex + 1} de {diagnosticQuestions.length}</Text>
                            <Text style={styles.quizScore}>Acertadas: {quizScore}</Text>
                        </View>
                        <Text style={styles.questionText}>{currentQuestion.question}</Text>
                        <View style={styles.optionList}>
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = selectedAnswer === index;
                                const isCorrect = index === currentQuestion.correct;
                                return (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.optionButton,
                                            isSelected && (isCorrect ? styles.optionCorrect : styles.optionWrong),
                                        ]}
                                        onPress={() => handleQuizAnswer(index)}
                                    >
                                        <Text style={styles.optionText}>{option}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        {selectedAnswer !== null && (
                            <View style={styles.feedbackBox}>
                                <Text style={styles.feedbackTitle}>{answerLabel}</Text>
                                <Text style={styles.feedbackText}>
                                    {selectedAnswer === currentQuestion.correct
                                        ? "Esta respuesta encaja con el enfoque crítico que buscamos."
                                        : "No pasa nada. Lo importante es avanzar y aprender a usar la IA con criterio."}
                                </Text>
                                <TouchableOpacity style={styles.primaryButton} onPress={handleQuizNext}>
                                    <Text style={styles.primaryButtonText}>
                                        {quizIndex === diagnosticQuestions.length - 1 ? "Ver retroalimentación" : "Siguiente pregunta"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                ) : (
                    <View style={styles.feedbackBox}>
                        <Text style={styles.feedbackTitle}>Retroalimentación final</Text>
                        <Text style={styles.feedbackText}>
                            Hiciste {quizScore} de {diagnosticQuestions.length} respuestas alineadas con buenas prácticas.
                            Sigue con la lectura para reforzar el uso responsable de la IA.
                        </Text>
                        <TouchableOpacity style={styles.primaryButton} onPress={finishLesson}>
                            <Text style={styles.primaryButtonText}>Continuar a la lectura</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    const renderReadingStep = () => (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Fundamentos sobre IA</Text>
            {(lesson.content?.paragraphs || []).map((paragraph) => (
                <Text key={paragraph} style={styles.paragraphText}>
                    {paragraph}
                </Text>
            ))}
            <TouchableOpacity style={styles.primaryButton} onPress={handleSpeech}>
                <MaterialIcons name={readingActive ? "stop" : "volume-up"} size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>{readingActive ? "Detener voz" : "Escuchar texto"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={finishLesson}>
                <Text style={styles.secondaryButtonText}>Seguir a la práctica</Text>
            </TouchableOpacity>
        </View>
    );

    const renderPracticeStep = () => (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Mejora un prompt</Text>
            <View style={styles.promptBox}>
                <Text style={styles.promptLabel}>Prompt original</Text>
                <Text style={styles.promptOriginal}>Hazme una tarea.</Text>
            </View>
            <Text style={styles.bodyText}>
                Reescríbelo usando Rol + Tarea + Contexto + Formato. La idea es ayudar a la IA a entender mejor lo que necesitas.
            </Text>
            <TextInput
                style={styles.promptInput}
                placeholder="Escribe tu nuevo prompt aquí"
                placeholderTextColor="#9CA3AF"
                multiline
                value={promptText}
                onChangeText={setPromptText}
            />
            <TouchableOpacity style={styles.primaryButton} onPress={handlePromptCheck}>
                <MaterialIcons name="fact-check" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Verificar</Text>
            </TouchableOpacity>
            {!!promptFeedback && <Text style={styles.statusText}>{promptFeedback}</Text>}
            <TouchableOpacity style={styles.secondaryButton} onPress={finishLesson}>
                <Text style={styles.secondaryButtonText}>Ir al certificado</Text>
            </TouchableOpacity>
        </View>
    );

    const renderCertificateStep = () => (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Insignia y certificado</Text>
            <Text style={styles.bodyText}>
                Completa el módulo y genera una insignia digital con código QR verificable y enfoque en ODS 4.
            </Text>
            <View style={styles.certificateCard}>
                <Text style={styles.certificateTitle}>Prompter crítico</Text>
                <Text style={styles.certificateSubtitle}>Uso ético de IA</Text>
                <QRCode value={certificateQrValue} size={170} />
                <Text style={styles.certificateCode}>Código: {certificateCode}</Text>
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={handleCertificatePdf}>
                <MaterialIcons name="verified" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Descargar certificado PDF</Text>
            </TouchableOpacity>
            {!!certificateStatus && <Text style={styles.statusText}>{certificateStatus}</Text>}
            <TouchableOpacity style={styles.secondaryButton} onPress={finishLesson}>
                <Text style={styles.secondaryButtonText}>Finalizar módulo</Text>
            </TouchableOpacity>
        </View>
    );

    const renderStepContent = () => {
        switch (stepType) {
            case "manual":
                return renderManualStep();
            case "diagnostic":
                return renderDiagnosticStep();
            case "reading":
                return renderReadingStep();
            case "practice":
                return renderPracticeStep();
            case "certificate":
                return renderCertificateStep();
            case "entry":
            default:
                return renderEntryStep();
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {renderHeader()}
                <View style={styles.metaRow}>
                    <View style={styles.metaChip}>
                        <Text style={styles.metaChipText}>{lesson.duration}</Text>
                    </View>
                    <View style={styles.metaChip}>
                        <Text style={styles.metaChipText}>{lesson.level}</Text>
                    </View>
                </View>
                {renderStepContent()}
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
    },
    hero: {
        borderRadius: 24,
        padding: 22,
        alignItems: "center",
        marginBottom: 16,
    },
    heroTitle: {
        color: "#fff",
        fontSize: 26,
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
        marginBottom: 16,
    },
    metaChip: {
        backgroundColor: "#fff",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
            },
            android: {
                elevation: 3,
            },
        }),
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
        gap: 14,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 10,
            },
            android: {
                elevation: 5,
            },
        }),
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
    tipBox: {
        backgroundColor: "#EEF2FF",
        borderRadius: 18,
        padding: 14,
    },
    tipLabel: {
        color: COLORS.primary,
        fontWeight: "700",
        marginBottom: 4,
    },
    tipText: {
        color: COLORS.text,
        lineHeight: 22,
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
    primaryButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },
    secondaryButton: {
        borderRadius: 16,
        minHeight: 48,
        paddingHorizontal: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    secondaryButtonText: {
        color: COLORS.primary,
        fontWeight: "700",
        fontSize: 15,
    },
    statusText: {
        color: COLORS.text,
        fontSize: 14,
        lineHeight: 20,
    },
    quizHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    quizProgress: {
        color: COLORS.textLight,
        fontWeight: "600",
    },
    quizScore: {
        color: COLORS.primary,
        fontWeight: "700",
    },
    questionText: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.text,
    },
    optionList: {
        gap: 10,
    },
    optionButton: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        padding: 14,
        backgroundColor: "#fff",
    },
    optionCorrect: {
        borderColor: COLORS.puertoTejadaGreen,
        backgroundColor: "#ECFDF5",
    },
    optionWrong: {
        borderColor: COLORS.error,
        backgroundColor: "#FEF2F2",
    },
    optionText: {
        color: COLORS.text,
        fontWeight: "600",
    },
    feedbackBox: {
        borderRadius: 16,
        backgroundColor: "#F9FAFB",
        padding: 14,
        gap: 10,
    },
    feedbackTitle: {
        color: COLORS.primary,
        fontWeight: "700",
        fontSize: 16,
    },
    feedbackText: {
        color: COLORS.textLight,
        lineHeight: 22,
    },
    paragraphText: {
        fontSize: 15,
        lineHeight: 24,
        color: COLORS.text,
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
    certificateCard: {
        alignItems: "center",
        gap: 10,
        padding: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#D1FAE5",
        backgroundColor: "#F0FDFA",
    },
    certificateTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    certificateSubtitle: {
        color: COLORS.textLight,
        marginBottom: 4,
    },
    certificateCode: {
        color: COLORS.textLight,
        fontWeight: "600",
    },
});

export default RequirementFlowScreen;
