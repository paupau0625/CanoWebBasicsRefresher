// script.js - form validation and submission display
(function(){
  const form = document.getElementById('enrollmentForm');
  const studentId = document.getElementById('studentId');
  const prefix = document.getElementById('prefix');
  const firstName = document.getElementById('firstName');
  const middleName = document.getElementById('middleName');
  const lastName = document.getElementById('lastName');
  const suffix = document.getElementById('suffix');
  const email = document.getElementById('email');
  const course = document.getElementById('course');
  const major = document.getElementById('major');
  const majorRow = document.getElementById('majorRow');
  const yearLevel = document.getElementById('yearLevel');
  const formMessage = document.getElementById('formMessage');
  const tableBody = document.querySelector('#submissionsTable tbody');

  function setError(id, msg){
    const el = document.getElementById('err-' + id);
    if(el) el.textContent = msg || '';
  }
  function clearError(id){ setError(id, ''); }

  function validEmail(v){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function normalizeName(){
    return [prefix.value, firstName.value, middleName.value, lastName.value, suffix.value]
      .map(s=>s.trim()).filter(Boolean).join(' ');
  }

  function validate(){
    let ok = true;
    // clear all errors first
    ['studentId','prefix','firstName','middleName','lastName','suffix','email','course','major','yearLevel'].forEach(clearError);

    if(!studentId.value || studentId.value.trim().length < 5){
      setError('studentId','Student ID is required (min 5 characters)'); ok = false;
    }
    if(prefix.value && prefix.value.trim().length < 2){ setError('prefix','If provided, prefix must be at least 2 characters'); ok = false; }
    if(!firstName.value || firstName.value.trim().length < 3){ setError('firstName','First name is required (min 3 characters)'); ok = false; }
    if(middleName.value && middleName.value.trim().length < 2){ setError('middleName','If provided, middle name must be at least 2 characters'); ok = false; }
    if(!lastName.value || lastName.value.trim().length < 2){ setError('lastName','Last name is required (min 2 characters)'); ok = false; }
    if(suffix.value && suffix.value.trim().length < 2){ setError('suffix','If provided, suffix must be at least 2 characters'); ok = false; }
    if(!email.value || !validEmail(email.value.trim())){ setError('email','Please enter a valid email address'); ok = false; }
    if(!course.value){ setError('course','Please select a course'); ok = false; }
    if(course.value === 'BSIT' && !major.value){ setError('major','Please select a major for BSIT'); ok = false; }
    if(!yearLevel.value){ setError('yearLevel','Please select year level'); ok = false; }

    return ok;
  }

  // show/hide major when course changes
  course.addEventListener('change', function(){
    if(course.value === 'BSIT'){
      majorRow.classList.remove('hidden');
    } else {
      majorRow.classList.add('hidden');
      major.value = '';
      clearError('major');
    }
    clearError('course');
  });

  // clear individual field error on input
  ['studentId','prefix','firstName','middleName','lastName','suffix','email','course','major','yearLevel'].forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.addEventListener('input', ()=> clearError(id));
    el.addEventListener('change', ()=> clearError(id));
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    formMessage.textContent = '';
    formMessage.style.color = '';

    if(!validate()){
      formMessage.textContent = 'Please fix the errors above.';
      formMessage.style.color = 'var(--danger)';
      return;
    }

    // build data row
    const tr = document.createElement('tr');
    const name = normalizeName();

    const cells = [
      studentId.value.trim(),
      name,
      email.value.trim(),
      course.value,
      (course.value === 'BSIT' ? major.value : ''),
      yearLevel.value
    ];

    cells.forEach(text=>{
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    });

    tableBody.appendChild(tr);

    formMessage.textContent = 'Enrollment submitted successfully.';
    formMessage.style.color = 'green';

    form.reset();
    majorRow.classList.add('hidden');

    setTimeout(()=>{ formMessage.textContent = ''; }, 3500);
  });

})();