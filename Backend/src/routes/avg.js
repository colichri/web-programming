function calculateAverage(req, res) {
    const numbers = req.body.numbers;
    if (!numbers || !Array.isArray(numbers)) {
        return res.status(400).json({ error: 'Invalid input' });
    }
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / numbers.length;
    return res.json({ average: avg });
}

module.exports = { calculateAverage };
