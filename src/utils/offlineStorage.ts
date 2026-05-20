const saveOfflineData = (
  payload: any
) => {

  const oldData =
    localStorage.getItem(
      "quizData"
    );

  const parsedData = oldData
    ? JSON.parse(oldData)
    : [];

  // ADD NEW USER
  parsedData.push(payload);

  localStorage.setItem(
    "quizData",
    JSON.stringify(parsedData)
  );

  console.log(
    "Saved Offline:",
    parsedData
  );
};