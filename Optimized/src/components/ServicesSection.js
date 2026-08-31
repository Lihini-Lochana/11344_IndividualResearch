import ServiceCard from "./ServiceCard";

import {
  FaEye,
  FaHeart,
  FaBone,
  FaUserNurse,
  FaBaby,
  FaFemale,
} from "react-icons/fa";

import useIsMobile from "../hooks/useIsMobile";

function ServicesSection() {

  const isMobile = useIsMobile();

  const services = [
    { title: "Eye Care", icon: <FaEye color="#2563EB" /> },
    { title: "Heart Care", icon: <FaHeart color="#EF4444" /> },
    { title: "Bone & Joint", icon: <FaBone color="#F59E0B" /> },
    { title: "Skin Care", icon: <FaUserNurse color="#10B981" /> },
    { title: "Child Care", icon: <FaBaby color="#06B6D4" /> },
    { title: "Women's Health", icon: <FaFemale color="#EC4899" /> },
  ];

  return (
    <section style={{ padding: isMobile ? "35px 20px" : "60px", }}>
      <h2 style={{ textAlign: "center", marginBottom: isMobile ? "25px" : "40px",
fontSize: isMobile ? "24px" : "30px", }}>
        Popular Health Services
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(6, 1fr)", 
          gap: isMobile ? "15px" : "20px",
        }}
      >
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            title={service.title}
            icon={service.icon}
            isMobile={isMobile}
          />
        ))}
      </div>
    </section>
  );
}

export default ServicesSection;