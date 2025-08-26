
        // Background images for hero section
        const backgroundImages = [
            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
        ];

        let currentImageIndex = 0;
        const hero = document.querySelector('.hero');

        // Set initial background
        hero.style.backgroundImage = `url(${backgroundImages[0]})`;

        // Change background every 4 seconds
        setInterval(() => {
            currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
            hero.style.backgroundImage = `url(${backgroundImages[currentImageIndex]})`;
        }, 4000);

        // Theme toggle functionality
        function toggleTheme() {
            const body = document.body;
            const themeToggle = document.querySelector('.theme-toggle i');
            
            if (body.getAttribute('data-theme') === 'dark') {
                body.removeAttribute('data-theme');
                themeToggle.className = 'fas fa-moon';
            } else {
                body.setAttribute('data-theme', 'dark');
                themeToggle.className = 'fas fa-sun';
            }
        }

        // Workout tab functionality
        function showWorkout(type) {
            // Remove active class from all tabs and content
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.workout-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            event.target.classList.add('active');
            
            // Show corresponding content
            document.getElementById(`${type}-workout`).classList.add('active');
        }

        // BMI Calculator
        function calculateBMI() {
            const weight = parseFloat(document.getElementById('weight').value);
            const height = parseFloat(document.getElementById('height').value);
            const age = parseInt(document.getElementById('age').value);
            const gender = document.getElementById('gender').value;
            const goal = document.getElementById('goal').value;

            if (!weight || !height || !age || !gender || !goal) {
                alert('Please fill all fields');
                return;
            }

            const heightInMeters = height / 100;
            const bmi = weight / (heightInMeters * heightInMeters);
            
            const result = document.getElementById('result');
            const bmiResult = document.getElementById('bmi-result');
            const recommendation = document.getElementById('recommendation');
            const dietPlan = document.getElementById('diet-plan');

            let bmiCategory, advice, dietAdvice;

            if (bmi < 18.5) {
                bmiCategory = 'Underweight';
                advice = 'You should focus on gaining healthy weight through proper nutrition and strength training.';
                dietAdvice = 'Recommended foods: Nuts, avocados, whole grains, lean proteins, healthy fats, protein shakes.';
            } else if (bmi >= 18.5 && bmi < 25) {
                bmiCategory = 'Normal Weight';
                advice = 'Maintain your current weight with balanced diet and regular exercise.';
                dietAdvice = 'Recommended foods: Balanced diet with fruits, vegetables, lean proteins, whole grains, and adequate water.';
            } else if (bmi >= 25 && bmi < 30) {
                bmiCategory = 'Overweight';
                advice = 'Focus on losing weight through cardio exercises and calorie-controlled diet.';
                dietAdvice = 'Recommended foods: Vegetables, fruits, lean proteins, reduce processed foods, control portions.';
            } else {
                bmiCategory = 'Obese';
                advice = 'Consult our trainers for a comprehensive weight loss program with diet and exercise.';
                dietAdvice = 'Recommended foods: High fiber vegetables, lean proteins, avoid sugar and processed foods, drink lots of water.';
            }

            bmiResult.innerHTML = `
                <p><strong>Your BMI: ${bmi.toFixed(1)}</strong></p>
                <p><strong>Category: ${bmiCategory}</strong></p>
            `;

            recommendation.innerHTML = `
                <h4>Recommendation:</h4>
                <p>${advice}</p>
            `;

            dietPlan.innerHTML = `
                <h4>Diet Suggestions:</h4>
                <p>${dietAdvice}</p>
                <p><strong>💡 Tip:</strong> Join our nutrition program for personalized meal plans!</p>
            `;

            result.style.display = 'block';
        }

        // Razorpay Payment Integration
        function initiatePayment(plan, amount) {
            const planNames = {
                'basic': 'Basic Plan',
                'premium': 'Premium Plan',
                'vip': 'VIP Plan'
            };

            const options = {
                "key": "rzp_test_9999999999", // Replace with your actual Razorpay key ID
                "amount": amount * 100, // Amount in paise (multiply by 100)
                "currency": "INR",
                "name": "Platinum Gym",
                "description": `${planNames[plan]} Membership`,
                "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
                "handler": function(response) {
                    // Payment successful
                    alert(`Payment Successful! 
                           Payment ID: ${response.razorpay_payment_id}
                           Plan: ${planNames[plan]}
                           Amount: ₹${amount}
                           
                           Welcome to Platinum Gym! 💪
                           You will receive a confirmation email shortly.`);
                    
                    // Send payment details to your server
                    sendPaymentDetails(response, plan, amount);
                    
                    // Show success message
                    showPaymentSuccess(planNames[plan], amount, response.razorpay_payment_id);
                },
                "prefill": {
                    "name": "",
                    "email": "",
                    "contact": ""
                },
                "notes": {
                    "gym_location": "Near Shiv Mandir, New Aman City, Garden Colony, Kharar, Punjab, 140301",
                    "plan_type": plan
                },
                "theme": {
                    "color": "#ff6b35"
                },
                "modal": {
                    "ondismiss": function(){
                        alert('Payment was cancelled. You can try again anytime!');
                    }
                }
            };

            const rzp1 = new Razorpay(options);
            rzp1.on('payment.failed', function(response) {
                alert(`Payment Failed! 
                       Error: ${response.error.description}
                       
                       Please try again or contact us at:
                       Phone: 8102579649
                       Email: vishalk81025@gmail.com`);
            });

            rzp1.open();
        }

        // Send payment details for processing
        function sendPaymentDetails(paymentResponse, plan, amount) {
            const paymentData = {
                payment_id: paymentResponse.razorpay_payment_id,
                plan: plan,
                amount: amount,
                timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                gym_contact: '8102579649',
                gym_email: 'vishalk81025@gmail.com'
            };

            // Log payment details (In real implementation, send to your server)
            console.log('💳 PAYMENT SUCCESSFUL - PLATINUM GYM');
            console.log('========================================');
            console.log(`💰 Payment ID: ${paymentData.payment_id}`);
            console.log(`📦 Plan: ${plan.toUpperCase()}`);
            console.log(`💵 Amount: ₹${amount}`);
            console.log(`⏰ Time: ${paymentData.timestamp}`);
            console.log(`📧 Send confirmation to gym: ${paymentData.gym_email}`);
            console.log(`📱 Contact: ${paymentData.gym_contact}`);
            console.log('========================================');

            // Create WhatsApp message for gym owner
            const whatsappMessage = `🏋️ PLATINUM GYM - NEW MEMBERSHIP!
💳 Payment Successful!
💰 Payment ID: ${paymentData.payment_id}
📦 Plan: ${plan.toUpperCase()} Plan
💵 Amount: ₹${amount}
⏰ Time: ${paymentData.timestamp}
🎉 Welcome new member to Platinum Gym!`;

            const whatsappLink = `https://wa.me/918102579649?text=${encodeURIComponent(whatsappMessage)}`;
            
            console.log('📱 WHATSAPP NOTIFICATION LINK:');
            console.log(whatsappLink);
        }

        // Show payment success modal
        function showPaymentSuccess(planName, amount, paymentId) {
            // Create success modal
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            `;

            modal.innerHTML = `
                <div style="
                    background: white;
                    padding: 3rem;
                    border-radius: 15px;
                    text-align: center;
                    max-width: 500px;
                    margin: 2rem;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                ">
                    <div style="font-size: 4rem; color: #27ae60; margin-bottom: 1rem;">✅</div>
                    <h2 style="color: #ff6b35; margin-bottom: 1rem;">Payment Successful!</h2>
                    <p style="font-size: 1.2rem; margin-bottom: 1rem;"><strong>${planName}</strong></p>
                    <p style="font-size: 2rem; color: #27ae60; font-weight: bold; margin-bottom: 1rem;">₹${amount}</p>
                    <p style="margin-bottom: 2rem; color: #666;">
                        Payment ID: <strong>${paymentId}</strong><br>
                        Welcome to Platinum Gym! 🏋️‍♂️
                    </p>
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        background: #ff6b35;
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 1.1rem;
                    ">Continue</button>
                </div>
            `;

            document.body.appendChild(modal);
        }

        // Contact form submission
        function submitForm(event) {
            event.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

            // Display contact information
            console.log('🏋️ NEW CONTACT FROM PLATINUM GYM WEBSITE!');
            console.log('==========================================');
            console.log(`👤 Name: ${name}`);
            console.log(`📧 Email: ${email}`);
            console.log(`📱 Phone: ${phone}`);
            console.log(`⏰ Time: ${timestamp}`);
            console.log(`💬 Message: "${message}"`);
            console.log('==========================================');

            // Create WhatsApp link
            const whatsappMessage = `🏋️ PLATINUM GYM CONTACT ALERT
New customer inquiry received!
👤 ${name}
📧 ${email}
📱 ${phone}
⏰ ${timestamp}
💬 "${message}"
Please respond promptly!`;

            const whatsappLink = `https://wa.me/918102579649?text=${encodeURIComponent(whatsappMessage)}`;
            
            console.log('🚨 NEW CONTACT - CLICK THIS WHATSAPP LINK:');
            console.log('==========================================');
            console.log('📱 WHATSAPP LINK (Click to open):');
            console.log(whatsappLink);
            console.log('📋 COPY THIS LINK AND PASTE IN YOUR BROWSER:');
            console.log(whatsappLink);
            console.log('==========================================');

            // Show success message
            alert(`Thank you ${name}! Your message has been sent successfully. 
                   We will contact you soon at ${phone} or ${email}.
                   
                   💪 Welcome to Platinum Gym!`);

            // Reset form
            document.querySelector('.contact-form').reset();
        }

        // Newsletter subscription
        function subscribeNewsletter(event) {
            event.preventDefault();
            
            const email = document.getElementById('newsletter-email').value;
            const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

            // Health tips for subscriber
            const healthTips = `🏋️ PLATINUM GYM - HEALTH TIPS WELCOME PACKAGE!

Welcome to our fitness family! Here are 5 professional health tips:

💪 1. CONSISTENCY IS KEY
   - Exercise at least 4-5 times per week
   - Even 30 minutes daily makes a difference

🥗 2. BALANCED NUTRITION
   - 40% carbs, 30% protein, 30% healthy fats
   - Eat every 3-4 hours to boost metabolism

💧 3. STAY HYDRATED
   - Drink 3-4 liters of water daily
   - Add lemon for better absorption

😴 4. QUALITY SLEEP
   - Get 7-8 hours of sleep nightly
   - Sleep helps muscle recovery and growth

📈 5. PROGRESSIVE OVERLOAD
   - Gradually increase weights each week
   - Track your progress for motivation

🎯 Ready to transform? Visit us at:
Near Shiv Mandir, New Aman City, Garden Colony, Kharar
Call: 8102579649

Your fitness journey starts NOW! 💪`;

            console.log('📧 NEWSLETTER SUBSCRIPTION - PLATINUM GYM');
            console.log('==========================================');
            console.log(`📧 Subscriber: ${email}`);
            console.log(`⏰ Time: ${timestamp}`);
            console.log('📋 HEALTH TIPS EMAIL CONTENT:');
            console.log(healthTips);
            console.log('==========================================');

            // Show success message
            alert(`🎉 Thank you for subscribing!
                   
                   You'll receive weekly health and fitness tips at:
                   ${email}
                   
                   Check your console for your welcome health tips package!
                   
                   💪 Welcome to the Platinum Gym family!`);

            // Reset form
            document.getElementById('newsletter-email').value = '';
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if (this.getAttribute('href') !== '#' && !this.onclick) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });

        // Animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe all sections for animations
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.section').forEach(section => {
                observer.observe(section);
            });
        });
    