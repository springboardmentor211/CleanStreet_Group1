import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { countryCodes } from "../assets/countryCodes";
import "../styles/profile.css";
const stateDistricts = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Kadapa', 'Anantapur', 'Chittoor', 'Prakasam', 'Srikakulam'],
  'Arunachal Pradesh': ['Itanagar', 'Tawang', 'Pasighat', 'Ziro', 'Bomdila', 'Aalo', 'Tezu', 'Changlang', 'Roing', 'Khonsa'],
  'Assam': ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat', 'Nagaon', 'Tezpur', 'Tinsukia', 'Bongaigaon', 'Dhubri', 'Karimganj'],
  'Bihar': ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Purnia', 'Arrah', 'Begusarai', 'Katihar', 'Munger'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Ambikapur', 'Raigarh', 'Dhamtari'],
  'Goa': ['North Goa', 'South Goa', 'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem', 'Sanguem'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Junagadh', 'Anand', 'Navsari'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula'],
  'Himachal Pradesh': ['Shimla', 'Kangra', 'Mandi', 'Solan', 'Sirmaur', 'Una', 'Chamba', 'Bilaspur', 'Hamirpur', 'Kullu'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Chas', 'Medininagar'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi', 'Kalaburagi', 'Davanagere', 'Ballari', 'Tumakuru', 'Shivamogga'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Kollam', 'Thrissur', 'Alappuzha', 'Palakkad', 'Malappuram', 'Kottayam', 'Kannur'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur', 'Nanded'],
  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Senapati', 'Ukhrul', 'Kakching', 'Tamenglong', 'Chandel', 'Jiribam'],
  'Meghalaya': ['Shillong', 'Tura', 'Nongpoh', 'Jowai', 'Baghmara', 'Williamnagar', 'Resubelpara', 'Mairang', 'Nongstoin', 'Ampati'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib', 'Lawngtlai', 'Saiha', 'Mamit', 'Saitual', 'Hnahthial'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Mon', 'Phek', 'Kiphire', 'Longleng'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Angul'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Hoshiarpur', 'Moga', 'Pathankot', 'Firozpur'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Alwar', 'Bhilwara', 'Sikar', 'Pali'],
  'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Rangpo', 'Jorethang', 'Singtam', 'Soreng', 'Chungthang', 'Pakyong'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Vellore', 'Erode', 'Tirunelveli', 'Thoothukudi', 'Dindigul'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Mahbubnagar', 'Adilabad', 'Suryapet', 'Nalgonda', 'Medak'],
  'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar', 'Ambassa', 'Belonia', 'Khowai', 'Sonamura', 'Teliamura', 'Bishalgarh'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Meerut', 'Allahabad', 'Ghaziabad', 'Noida', 'Moradabad', 'Bareilly'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Nainital', 'Haldwani', 'Roorkee', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Pithoragarh', 'Almora'],
  'West Bengal': ['Kolkata', 'Siliguri', 'Howrah', 'Durgapur', 'Asansol', 'Malda', 'Bardhaman', 'Kharagpur', 'Haldia', 'Jalpaiguri'],
  // Union Territories
  'Andaman and Nicobar Islands': ['Port Blair', 'Havelock', 'Neil Island', 'Diglipur', 'Mayabunder', 'Rangat', 'Little Andaman', 'Car Nicobar', 'Kamorta', 'Katchal'],
  'Chandigarh': ['Chandigarh'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Diu', 'Silvassa', 'Amli', 'Khanvel', 'Dadra', 'Naroli', 'Samarvarni', 'Rakholi', 'Vasona'],
  'Delhi': ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Shahdara', 'Dwarka', 'Rohini', 'Karol Bagh'],
  'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Kathua', 'Kupwara', 'Pulwama', 'Rajouri', 'Poonch'],
  'Ladakh': ['Leh', 'Kargil', 'Nubra', 'Zanskar', 'Dras', 'Diskit', 'Padum', 'Tangtse', 'Saspotse', 'Turtuk'],
  'Lakshadweep': ['Kavaratti', 'Agatti', 'Amini', 'Andrott', 'Bitra', 'Chetlat', 'Kadmat', 'Kalpeni', 'Kiltan', 'Minicoy'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam', 'Oulgaret', 'Villianur', 'Bahour', 'Nettapakkam', 'Ariyankuppam', 'Mannadipet'],
};
const Profile = () => {
  // Dummy data for demonstration
  const defaultProfile = {
    username: "Demo_username",
    email: "cleanstreet@gmail.com",
    countryCode: "+91",
    phone: "9876543210",
    bio: "Keep the environment clean",
  addressLine1: "Flat.no 212, Maruthi Apartments",
  addressLine2: "Near Delhi School, Sanjev Nagar",
    state: "Telangana",
    pincode: "500025"
  };

  const navigate = useNavigate();
  // Profile picture state
  const getInitialProfile = () => {
    const stored = localStorage.getItem("profileData");
    return stored ? JSON.parse(stored) : defaultProfile;
  };
  const [savedUser, setSavedUser] = useState(getInitialProfile());
  const [displayUser, setDisplayUser] = useState(getInitialProfile());

  // Load profile picture from localStorage
  const getInitialPic = () => localStorage.getItem("profilePic") || null;
  const [profilePic, setProfilePic] = useState(getInitialPic());

  // Save to localStorage when savedUser changes
  useEffect(() => {
    localStorage.setItem("profileData", JSON.stringify(savedUser));
  }, [savedUser]);

  // Save profile picture to localStorage
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        localStorage.setItem("profilePic", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile picture from localStorage
  const handleRemovePic = () => {
    setProfilePic(null);
    localStorage.removeItem("profilePic");
    // Notify other components in this tab
    window.dispatchEvent(new Event("profilePicChanged"));
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDisplayUser((prev) => ({ ...prev, [name]: value }));
  };

  // Email validation: must be a valid email and end with .com, .in, .co.in, .org, .net, .edu, .gov, .gmail, etc.
  const emailRegex = /^[\w-.]+@[\w-]+\.(gmail|com|in|co\.in|org|net|edu|gov)$/i;
  const isEmailValid = emailRegex.test(displayUser.email);

  // Phone validation: must be digits only, length 5-15
  const isPhoneValid = /^\d{5,15}$/.test(displayUser.phone);

  // Check if any field is empty or null (except countryCode)
  const isAnyFieldEmpty = Object.entries(displayUser).some(
    ([key, val]) => key !== "countryCode" && (!val || val.trim() === "")
  );

  // Disable save if any field is empty, email/phone invalid
  const isSaveDisabled = isAnyFieldEmpty || !isEmailValid || !isPhoneValid;

  return (
    <div className="profile-main-container">
      <div className="profile-left">
        <h2>Edit Profile</h2>
        <form className="profile-form-view" autoComplete="off">
          <label>Username</label>
          <input name="username" value={displayUser.username} onChange={handleChange}  />
          <label>Email</label>
          <input name="email" value={displayUser.email} onChange={handleChange} />
          {!isEmailValid && <div style={{ color: "#f44336", fontSize: 13, marginTop: 2 }}>Enter a valid email (e.g. user@gmail.com, user@email.co.in)</div>}
          <label>Contact Number</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select
              name="countryCode"
              value={displayUser.countryCode}
              onChange={handleChange}
              style={{ minWidth: 160, borderRadius: 8, padding: "7px 8px", border: "1px solid #ccc", background: "#f8f8f8" }}
            >
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
              ))}
            </select>
            <input
              name="phone"
              value={displayUser.phone}
              onChange={handleChange}
              placeholder="Enter number"
              style={{ flex: 1 }}
              maxLength={15}
            />
          </div>
          {!isPhoneValid && <div style={{ color: "#f44336", fontSize: 13, marginTop: 2 }}>Enter a valid phone number</div>}
          <label>Bio</label>
          <input name="bio" value={displayUser.bio} onChange={handleChange} />
          <label>Address Line 1</label>
          <input name="addressLine1" value={displayUser.addressLine1} onChange={handleChange} />
          <label>Address Line 2</label>
          <input name="addressLine2" value={displayUser.addressLine2} onChange={handleChange} />
          <label>State</label>
          <select
            name="state"
            value={displayUser.state}
            onChange={handleChange}
            style={{ borderRadius: 8, padding: "7px 8px", border: "1px solid #ccc", background: "#f8f8f8" }}
          >
            <option value="">Select State</option>
            {Object.keys(stateDistricts).map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <label>District</label>
          <select
            name="district"
            value={displayUser.district}
            onChange={handleChange}
            style={{ borderRadius: 8, padding: "7px 8px", border: "1px solid #ccc", background: "#f8f8f8" }}
            disabled={!displayUser.state}
          >
            <option value="">{displayUser.state ? "Select District" : "Select State First"}</option>
            {displayUser.state && stateDistricts[displayUser.state]?.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
          <label>Pincode</label>
          <input name="pincode" value={displayUser.pincode} onChange={handleChange}/>
          <div className="profile-btn-row">
            <button type="button" className="profile-btn cancel" onClick={() => setDisplayUser(savedUser)}>Cancel</button>
            <button
              type="button"
              className="profile-btn save"
              onClick={() => setSavedUser(displayUser)}
              disabled={isSaveDisabled}
              style={isSaveDisabled ? { opacity: 0.6, cursor: "not-allowed" } : {}}
            >
              Save Detail's
            </button>
          </div>
        </form>
      </div>
      <div className="profile-right">
        <div className="profile-avatar-large">
          {profilePic ? (
            <img src={profilePic} alt="Profile" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "4px solid #22223b", background: "#fff" }} />
          ) : (
            <svg height="100" width="100" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="28" stroke="#22223b" strokeWidth="4" fill="#fff" />
              <circle cx="30" cy="24" r="10" fill="#bdbdbd" />
              <ellipse cx="30" cy="44" rx="14" ry="8" fill="#bdbdbd" />
            </svg>
          )}
        </div>
        <div className="profile-account-info">
          <h2>User's Details</h2>
          <div className="profile-account-username-row">
            <span className="profile-account-username">{savedUser.username}</span>
          </div>
          <div>{savedUser.email}</div>
          <div>{savedUser.countryCode} {savedUser.phone}</div>
          <div>{savedUser.bio}</div>
          <div>{savedUser.addressLine1}</div>
          <div>{savedUser.addressLine2}</div>
          <div>{savedUser.state}</div>
          <div>{savedUser.district}</div>
          <div>{savedUser.pincode}</div>
        </div>
        <div className="profile-btn-row">
          <button
            type="button"
            className="profile-btn done"
            onClick={() => navigate("/")}
          >
            Done
          </button>
        </div>
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <label htmlFor="profile-pic-upload" style={{ cursor: "pointer", color: "#3ec6b8", fontWeight: 600 }}>
            {profilePic ? "Change Profile Picture" : "Add Profile Picture"}
          </label>
          <input
            id="profile-pic-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleProfilePicChange}
          />
          {profilePic && (
            <div style={{ marginTop: 10 }}>
              <button
                type="button"
                style={{ background: "#f44336", color: "#fff", border: "none", borderRadius: 6, padding: "6px 16px", cursor: "pointer", fontWeight: 500 }}
                onClick={handleRemovePic}
              >
                Remove Profile Picture
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
