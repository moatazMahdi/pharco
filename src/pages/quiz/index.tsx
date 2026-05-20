import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";

const correctAnswers = [
  "No",
  "Yes",
  "No",
  "Yes",
  "Yes",
  "Yes",
  "Yes",
  "Yes",
  "No",
  "Yes",
];

const questions = [
  "LEVOTAVIN® (levofloxacin) PHARCO is 5 tablets Only ?",

  "LEVOTAVIN® (levofloxacin) Oral tab. considered anti pseudomonal drug For HAP management ?",

  "LEVOTAVIN® (levofloxacin) 500 mg 7 tabs Price is 150 EGP?",

  "LEVOTAVIN® (levofloxacin) among the most active Abs. tested against S.pneumoniae isolated from CAP patients in different geographic regions",

  "LEVOTAVIN® (levofloxacin) is Empiric Oral AB* with highest efficacy against G+ve , G-ve & Atypical bacteria for all adults",

  "LEVOTAVIN® (levofloxacin) High concentration in all infected tissues as Lung tissue(alveoli) that reach 50 folds more when compared to B lactam",

  "LEVOTAVIN (levofloxacin) has an enhanced activity against most pathogens associated with ABRS",

  "LEVOTAVIN (levofloxacin) Considered Injectable Tablet as it reach peak plasma concentration with 1-2 hours & has 99% Bioavailability",

  "LEVOTAVIN (levofloxacin) has NO results over resistant bacteria in community and nosocomial infections (E.coli, Pseudomonas aeruginosa, MDRSP, Acinetobacter & klebsiella)",

  "LEVOTAVIN (levofloxacin) is recommended as One of the standard empiric therapies in combination with β-lactam for inpatients with severe pneumonia according to ATS recommendations ?",
];

export default function QuizPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const name = searchParams.get("name");

  const mobile = searchParams.get("mobile");

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState<"Yes" | "No" | null>(
    null,
  );

  const [answers, setAnswers] = useState<
    {
      question: string;
      answer: string;
    }[]
  >([]);

  const [showPopup, setShowPopup] = useState(false);

  const [clientNumber, setClientNumber] = useState<number | null>(null);

  // =========================
  // SEND OFFLINE DATA
  // =========================

  const syncOfflineData = async () => {
    const localData = localStorage.getItem("quizData");

    if (!localData) return;

    const parsedData = JSON.parse(localData);

    const failedItems = [];

    for (const item of parsedData) {
      try {
        const res = await fetch("/api/save-result", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(item),
        });

        const data = await res.json();

        if (!data.success) {
          failedItems.push(item);
        }
      } catch (error) {
        failedItems.push(item);
      }
    }

    // SAVE FAILED ONLY
    if (failedItems.length > 0) {
      localStorage.setItem("quizData", JSON.stringify(failedItems));
    } else {
      localStorage.removeItem("quizData");
    }

    console.log("Offline Sync Finished");
  };

  // =========================
  // INTERNET LISTENER
  // =========================

  useEffect(() => {
    syncOfflineData();

    window.addEventListener("online", syncOfflineData);

    return () => {
      window.removeEventListener("online", syncOfflineData);
    };
  }, []);

  const saveOfflineData = (payload: any) => {
    const oldData = localStorage.getItem("quizData");

    const parsedData = oldData ? JSON.parse(oldData) : [];

    parsedData.push(payload);

    localStorage.setItem("quizData", JSON.stringify(parsedData));

    console.log("Saved Offline:", parsedData);
  };

  // =========================
  // NEXT QUESTION
  // =========================

  const handleNext = async () => {
    if (!selectedAnswer) {
      alert("Please select Yes or No");

      return;
    }

    const updatedAnswers = [
      ...answers,

      {
        question: questions[currentQuestion],

        answer: selectedAnswer,
      },
    ];

    const score = updatedAnswers.filter(
      (item, index) => item.answer === correctAnswers[index],
    ).length;

    setAnswers(updatedAnswers);

    // =========================
    // NEXT QUESTION
    // =========================

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);

      setSelectedAnswer(null);
    }

    // =========================
    // FINISH QUIZ
    // =========================
    else {
      const payload = {
        name,
        mobile: `+2${mobile}`,
        score,
        answers: updatedAnswers,
      };

      // =========================
      // ONLINE
      // =========================

      if (navigator.onLine) {
        const res = await fetch("/api/save-result", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        });

        const data = await res.json();

        setClientNumber(data.clientNumber);
      }

      // =========================
      // OFFLINE
      // =========================
      else {
        saveOfflineData(payload);

        console.log("Saved Offline Successfully");

        setClientNumber(Math.floor(Math.random() * 10000) + 1);
      }

      setShowPopup(true);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fff",

        padding: "60px 80px 40px",

        fontFamily: "Arial",

        display: "flex",

        flexDirection: "column",
      }}
    >
      {/* LOGOS */}

      <div
        style={{
          display: "flex",

          justifyContent: "space-between",

          marginBottom: "20px",
        }}
      >
        <Image
          src="/images/logo2.png"
          alt="Pharco"
          width={300}
          height={100}
          priority
        />

        <Image
          src="/images/logo1.png"
          alt="Levotavin"
          width={300}
          height={100}
          priority
        />
      </div>

      {/* QUESTION */}

      <div
        style={{
          flex: 1,

          display: "flex",

          flexDirection: "column",

          justifyContent: "center",

          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontSize: "42px",

            fontWeight: "bold",

            textAlign: "center",

            maxWidth: "1400px",

            lineHeight: 1.4,

            marginBottom: "100px",

            color: "black",
          }}
        >
          {questions[currentQuestion]}
        </h1>

        {/* ANSWERS */}

        <div
          style={{
            display: "flex",

            gap: "30px",

            marginBottom: "20px",
          }}
        >
          {/* YES */}

          <button
            onClick={() => setSelectedAnswer("Yes")}
            style={{
              width: "180px",

              height: "120px",

              border: selectedAnswer === "Yes" ? "6px solid #0047D9" : "none",

              borderRadius: "35px",

              background: selectedAnswer === "Yes" ? "#DCEBFF" : "#E8F0F8",

              fontSize: "72px",

              fontWeight: "bold",

              cursor: "pointer",

              transition: "0.2s",
              color: "black",
            }}
          >
            Yes
          </button>

          {/* NO */}

          <button
            onClick={() => setSelectedAnswer("No")}
            style={{
              width: "180px",

              height: "120px",

              border: selectedAnswer === "No" ? "6px solid #0047D9" : "none",

              borderRadius: "35px",

              background: selectedAnswer === "No" ? "#DCEBFF" : "#E8F0F8",

              fontSize: "72px",

              fontWeight: "bold",

              cursor: "pointer",

              transition: "0.2s",
              color: "black",
            }}
          >
            No
          </button>
        </div>

        {/* COUNTER */}

        <div
          style={{
            fontSize: "48px",

            fontWeight: "600",
          }}
        >
          {currentQuestion + 1} / {questions.length}
        </div>
      </div>

      {/* BOTTOM BUTTONS */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          //   justifyContent: "space-between",
          gap: "20px",
          alignItems: "center",

          marginTop: "40px",
        }}
      >
     <button
          onClick={handleNext}
          style={{
            width: "40%",
            height: "80px",

            border: "none",

            borderRadius: "20px",

            background: "#0047D9",

            color: "#fff",

            fontSize: "32px",

            fontWeight: "bold",

            cursor: "pointer",
          }}
        >
          Next
        </button>

        
        <button
          onClick={() => router.push("/")}
          style={{
            width: "40%",

            height: "80px",

            borderWidth: "2px",
            
            borderColor: "black",

            borderRadius: "20px",

            background: "white",

            fontSize: "32px",

            fontWeight: "bold",

            cursor: "pointer",

            color: "black",

            
          }}
        >
          Home
        </button>

   
      </div>

      {/* POPUP */}

      {showPopup && (
        <div
          style={{
            position: "fixed",

            inset: 0,

            background: "rgba(0,0,0,0.45)",

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "520px",

              background: "#fff",

              borderRadius: "40px",

              padding: "50px 40px",

              textAlign: "center",

              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >
             <Image
          src="/images/logo1.png"
          alt="Pharco"
          width={300}
          height={100}
          priority
        />
          

            <h2
              style={{
                fontSize: "42px",

                color: "#111827",

                marginBottom: "20px",
              }}
            >
              Quiz Submitted
            </h2>

            <p
              style={{
                fontSize: "26px",

                color: "#6B7280",

                marginBottom: "15px",
              }}
            >
              Your Client Number
            </p>

            <div
              style={{
                fontSize: "72px",

                fontWeight: "bold",

                color: "#0047D9",

                marginBottom: "20px",
              }}
            >
              #{clientNumber}
            </div>

            <div
              style={{
                fontSize: "30px",

                fontWeight: "bold",

                color: "black",

                marginBottom: "40px",
              }}
            >
             Stay tuned for the draw on valuable prizes!
            </div>

            <button
              onClick={() => {
                setShowPopup(false);

                router.push("/");
              }}
              style={{
                width: "100%",

                height: "75px",

                border: "none",

                borderRadius: "18px",

                background: "#0047D9",

                color: "#fff",

                fontSize: "28px",

                fontWeight: "bold",

                cursor: "pointer",
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
