export const filterDoctors = (doctors, filters) => {
  let result = [...doctors];

  if (filters.doctorName) {
    result = result.filter((d) =>
      d.name.toLowerCase().includes(filters.doctorName.toLowerCase()),
    );
  }

  if (filters.hospital) {
    result = result.filter((d) =>
      d.hospitals.some((h) => h.name === filters.hospital),
    );
  }

  if (filters.specialization) {
    result = result.filter((d) => d.specialization === filters.specialization);
  }

  if (filters.date) {
    result = result.filter((d) => d.availableDates.includes(filters.date));
  }

  return result;
};
