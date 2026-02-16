export const logAction = (action, userEmail = "Anonymous") => {
    const timestamp = new Date().toISOString();
    const logEntry = {
        time: timestamp,
        user: userEmail,
        action: action
    };

    console.log(`%c[LOG] ${timestamp} | ${userEmail}: ${action}`, "color: #00d2ff; font-weight: bold;");
};