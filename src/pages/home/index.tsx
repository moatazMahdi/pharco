
import Image from "next/image";
import { User, Phone, ArrowRight } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  // Validation
  const isNameValid = name.trim().length >= 2;

  const isMobileValid =
    mobile.length === 11 &&
    /^[0-9]+$/.test(mobile);

  const isFormValid =
    isNameValid && isMobileValid;

  const handleStartQuiz = () => {
    if (!isFormValid) return;

    router.push({
      pathname: "/quiz",

      query: {
        name,
        mobile,
      },
    });
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: "60px 80px",
        fontFamily: "Arial",
      }}
    >
      {/* Top Logos */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "120px",
        }}
      >
        <Image
          src="/images/logo2.png"
          alt="Pharco"
          width={220}
          height={100}
          priority
        />

        <Image
          src="/images/logo1.png"
          alt="Levotavin"
          width={320}
          height={100}
          priority
        />
      </div>

      {/* Form */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "820px",
          }}
        >
          {/* Name */}
          <div
            style={{
              height: "88px",
              border: "2px solid #E5E7EB",
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              marginBottom: "35px",
               background:"#fff"
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100%",
                borderRight: "2px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
               
              }}
            >
              <User size={38} color="#0B4DCC" />
            </div>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              style={{
                flex: 1,
                height: "100%",
                border: "none",
                outline: "none",
                padding: "0 30px",
                fontSize: "24px",
                color: "#111827",
                background:"#fff"
              }}
            />
          </div>

          {/* Mobile */}
          <div
            style={{
              height: "88px",
              border: "2px solid #E5E7EB",
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              marginBottom: "50px",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100%",
                borderRight: "2px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Phone size={34} color="#0B4DCC" />
            </div>

            <input
              type="tel"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => {
                const value =
                  e.target.value.replace(/\D/g, "");

                if (value.length <= 11) {
                  setMobile(value);
                }
              }}
              style={{
                flex: 1,
                height: "100%",
                border: "none",
                outline: "none",
                padding: "0 30px",
                fontSize: "24px",
                color: "#111827",
                background:"#fff"
              }}
            />
          </div>

          {/* Button */}
          <button
            onClick={handleStartQuiz}
            disabled={!isFormValid}
            style={{
              width: "100%",
              height: "95px",
              border: "none",
              borderRadius: "24px",

              background: isFormValid
                ? "#0047D9"
                : "#A0AEC0",

              color: "#fff",
              fontSize: "34px",
              fontWeight: "bold",

              cursor: isFormValid
                ? "pointer"
                : "not-allowed",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "18px",

              transition: "0.2s",
            }}
          >
            Start Quiz
            <ArrowRight size={40} />
          </button>
        </div>
      </div>
    </main>
  );
}