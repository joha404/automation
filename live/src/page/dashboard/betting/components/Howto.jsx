import CommonTitle from '@/components/texts/CommonTitle';
import { useTheme } from '@/hooks/custom/useTheme';
import React from 'react'

const Howto = () => {
      const { theme } = useTheme();
    
  return (
    <div>
        <div  className={`rounded-xl max-w-5xl mx-auto font-primary lg:p-10 p-5 shadow-sm border transition-colors duralightgtext-lighterGrey mt-5 ${
          theme === "dark"
            ? "bg-darkBlack border-mediumBlack"
            : "bg-white border-lightestGrey"
        } `}>
        <div className="text-center lg:mb-5 mb-2.5">
        <CommonTitle variant='small'
          className="font-semibold text-center"
        >
          How To
        </CommonTitle>
        </div>
        
        <div className="lg:space-y-4 space-y-2 mx-auto">
          <div className="flex items-start justify-center text-center space-x-3">
            <div className="flex-shrink-0 w-5 h-5 bg-mediumBlue text-white text-xs font-semibold rounded-full flex items-center justify-center mt-0.5">
              1
            </div>
            <div>
              <span className={`font-semibold ${
                theme === "dark" ? "text-mediumBlue" : "text-mediumBlue"
              }`}>Starting Bankroll:</span>
              <span className={`ml-2 text-sm ${
                theme === "dark" ? "text-lighterGrey" : "text-darkerGrey"
              }`}>
                Select the amount in dollars that your starting bankroll would be
              </span>
            </div>
          </div>
          
          <div className="flex items-start justify-center text-center space-x-3">
            <div className="flex-shrink-0 w-5 h-5 bg-mediumBlue text-white text-xs font-semibold rounded-full flex items-center justify-center mt-0.5">
              2
            </div>
            <div>
              <span className={`font-semibold ${
                theme === "dark" ? "text-mediumBlue" : "text-mediumBlue"
              }`}>Starting Date:</span>
              <span className={`ml-2 text-sm ${
                theme === "dark" ? "text-lighterGrey" : "text-darkerGrey"
              }`}>
                Choose the date you would like to have started from
              </span>
            </div>
          </div>
          
          <div className="flex items-start justify-center text-center space-x-3">
            <div className="flex-shrink-0 w-5 h-5 bg-mediumBlue text-white text-xs font-semibold rounded-full flex items-center justify-center mt-0.5">
              3
            </div>
            <div>
              <span className={`font-semibold ${
                theme === "dark" ? "text-mediumBlue" : "text-mediumBlue"
              }`}>Results:</span>
              <span className={`ml-2 text-sm ${
                theme === "dark" ? "text-lighterGrey" : "text-darkerGrey"
              }`}>
                Calculate what your total profit, profit in units, and new bankroll today would be
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default Howto