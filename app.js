const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors'); // اضافه کردن بسته cors

app.use(bodyParser.json());

// استفاده از cors برای اجازه‌دهی به دسترسی از دامنه‌های دیگر
app.use(cors());

const contracts = [
  { id: 1, header: 'هدر قرارداد 1', text: 'متن قرارداد 1', isMandatory: true },
  { id: 2, header: 'هدر قرارداد 2', text: 'متن قرارداد 2', isMandatory: false },
  { id: 3, header: 'هدر قرارداد 3', text: `صفحه اصلی باید از یک هدر ( ،)headerبدنهی اصلی ( )bodyو فوتر ( )footerتشکیل شده باشد. طراحی این بخش بر
  اساس فایل فتوشاپ که پیوست ایمیل می باشد، منطبق باشد.
   .2این صفحه باید قابلیت نمایش در اندازههای مختلف صفحه ( )responsiveرا داشته باشد. این به این معناست که باید به
  خوبی بر روی صفحات کوچکتر مانند موبایلها و تبلتها نیز قابل نمایش و استفاده باشد.
   3از
  ًلطفا
  .  CSSو  media queriesبرای تنظیم ظاهر صفحه در اندازههای مختلف استفاده کنید.
   .4صفحه باید به یک  APIساده متصل شود، دادهها را دریافت کند و آنها را به صورت مناسبی در صفحه نمایش دهد`
  , isMandatory: false },
  { id: 4, header: 'هدر قرارداد 4', text: 'متن قرارداد 4', isMandatory: false },
];

// Create a new contract
app.post('/contracts', (req, res) => {
  const { header, text, isMandatory } = req.body;
  if (text && typeof isMandatory === 'boolean') {
    const newContract = {
      id: contracts.length + 1,
      header: header || '',
      text: text,
      isMandatory: isMandatory,
    };
    contracts.push(newContract);
    res.status(201).json(newContract);
  } else {
    res.status(400).json({ error: 'Invalid data' });
  }
});


// Read all contracts
app.get('/contracts', (req, res) => {
  res.json(contracts);
});

// Read a specific contract
app.get('/contracts/:id', (req, res) => {
  const contractId = parseInt(req.params.id);
  const contract = contracts.find((c) => c.id === contractId);
  if (contract) {
    res.json(contract);
  } else {
    res.status(404).json({ error: 'Contract not found' });
  }
});

// Update a contract
app.put('/contracts/:id', (req, res) => {
  const contractId = parseInt(req.params.id);
  const contract = contracts.find((c) => c.id === contractId);
  if (contract) {
    const { header, text, isMandatory } = req.body;
    if (text && typeof isMandatory === 'boolean') {
      contract.header = header || '';
      contract.text = text;
      contract.isMandatory = isMandatory;
      res.json(contract);
    } else {
      res.status(400).json({ error: 'Invalid data' });
    }
  } else {
    res.status(404).json({ error: 'Contract not found' });
  }
});


// Delete a contract
app.delete('/contracts/:id', (req, res) => {
  const contractId = parseInt(req.params.id);
  const index = contracts.findIndex((c) => c.id === contractId);
  if (index !== -1) {
    contracts.splice(index, 1);
    res.json({ message: 'Contract deleted successfully' });
  } else {
    res.status(404).json({ error: 'Contract not found' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
