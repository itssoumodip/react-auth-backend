import React from 'react';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';

const ToggleButton = ({ isChecked, onChange, disabled = false }) => {
  return (
    <div className="flex flex-col items-center px-5 py-3 transition-all duration-300">
      <div className="flex items-center space-x-3 mb-1">
        <span 
          className={`
            font-medium text-sm transition-all duration-300
            ${!isChecked 
              ? 'text-blue-700 scale-110' 
              : 'text-gray-500'
            }
          `}
        >
          Login
        </span>
        
        <div className="relative inline-block">
          <div 
            className={`
              w-[70px] h-[34px] relative mx-auto 
              rounded-full shadow-inner
              transition-all duration-500
              ${isChecked 
                ? 'bg-gradient-to-r from-blue-400 to-indigo-600' 
                : 'bg-gradient-to-r from-blue-400 to-indigo-600'
              }
            `}
          >
            <input
              type="checkbox"
              className="w-full h-full opacity-0 z-30 absolute cursor-pointer peer"
              checked={isChecked}
              onChange={onChange}
              disabled={disabled}
              id="toggle-button"
              aria-label={isChecked ? "Switch to login" : "Switch to signup"}
            />
            
            <div className="absolute z-20 inset-0.5 rounded-full bg-white/10 transition-all duration-300">
              <span 
                className={`
                  absolute top-[3px] w-[26px] h-[26px] 
                  bg-white
                  flex items-center justify-center
                  text-xs font-semibold
                  rounded-full 
                  shadow-md
                  transition-all duration-500 ease-in-out
                  ${isChecked 
                    ? 'translate-x-[40px] text-indigo-600' 
                    : 'translate-x-[2px] text-blue-600'
                  }
                  ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {isChecked ? <FiUserPlus className="text-xs" /> : <FiLogIn className="text-xs" />}
              </span>
            </div>
          </div>
        </div>
        
        <span 
          className={`
            font-medium text-sm transition-all duration-300
            ${isChecked 
              ? 'text-indigo-700 scale-110 font-bold' 
              : 'text-gray-500'
            }
          `}
        >
          Signup
        </span>
      </div>
    </div>
  );
};

export default ToggleButton;