"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

function Registerpage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("User");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const payload =
        role === "User"
          ? { name, email, password, role }
          : { name, email, password, role, companyName, companyDomain, contactNumber, amount };

      const response = await fetch('/api/auth/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "User already exists") {
          if (confirm("An account with this email already exists. Do you want to log in instead?")) {
            router.push('/login');
          } else {
            throw new Error(data.message || 'Registration failed due to server error.');
          }
        }
        return;
      }

      alert("Registration successful! Please log in.");
      router.push('/login');
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#8c6fb8b2] p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 md:p-10 border-t-4 border-[#d1c7e2]">
        <h1 className="text-3xl font-bold text-[#364F6B] text-center mb-6">Registration Page</h1>
        <form onSubmit={handleSubmit} className="text-black">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column */}
            <div className="flex-1 space-y-4">
              <FormRow label="Role:" htmlFor="role">
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d1c7e2] text-[#364F6B]"
                >
                  <option value="User">User</option>
                  <option value="Manager">Manager</option>
                </select>
              </FormRow>

              <FormInput id="name" label="Name:" value={name} setValue={setName} />
              <FormInput id="email" label="Email:" type="email" value={email} setValue={setEmail} />

              {role === "Manager" && (
                <>
                  <FormInput id="companyName" label="Company Name:" value={companyName} setValue={setCompanyName} />
                  <FormInput id="companyDomain" label="Company Domain:" value={companyDomain} setValue={setCompanyDomain} />
                </>
              )}
            </div>

            {/* Right Column */}
            <div className="flex-1 space-y-4">
              <FormInput id="password" label="Password:" type="password" value={password} setValue={setPassword} />
              <FormInput id="confirmPassword" label="Confirm Password:" type="password" value={confirmPassword} setValue={setConfirmPassword} />

              {role === "Manager" && (
                <>
                  <FormInput id="contactNumber" label="Contact Number:" value={contactNumber} setValue={setContactNumber} />
                  <FormInput id="amount" label="Amount:" type="number" value={amount} setValue={setAmount} />
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="w-full md:w-1/3 bg-[#8c6fb8e0] hover:bg-[#8c6fb8] text-black font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md"
            >
              Register
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-[#FC5185] mt-4">
          Already have an account? <a href="/login" className="underline">Login here</a>
        </p>
      </div>
    </div>
  );
}

// Reusable Components
function FormRow({ label, htmlFor, children }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4">
      <label className="w-full sm:w-36 font-semibold text-[#364F6B]" htmlFor={htmlFor}>
        {label}
      </label>
      <div className="w-full">{children}</div>
    </div>
  );
}

function FormInput({ id, label, value, setValue, type = "text" }) {
  return (
    <FormRow label={label} htmlFor={id}>
      <input
        id={id}
        type={type}
        placeholder={label.replace(":", "")}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FC1C9]"
      />
    </FormRow>
  );
}

export default Registerpage;
