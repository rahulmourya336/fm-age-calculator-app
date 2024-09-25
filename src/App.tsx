import "./reset.css";
import "./App.css";
import { ChangeEvent, useCallback, useState } from "react";
import { useForm } from "react-hook-form";

interface IAge {
  day: number | undefined;
  month: number | undefined;
  year: number | undefined;
}

interface IResult {
  days: number | undefined;
  months: number | undefined;
  years: number | undefined;
}

type FormFields = "day" | "month" | "year";

function App() {
  const [dob, setDob] = useState<IAge>({
    day: undefined,
    month: undefined,
    year: undefined,
  });

  const [result, setResult] = useState<IResult>({
    days: undefined,
    months: undefined,
    years: undefined,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Record<FormFields, string>>();

  const handleAge = useCallback(() => {
    calculateAge(`${dob.year}-${dob.month}-${dob.day}`);
  }, [dob.day, dob.month, dob.year]);

  const calculateAge = (_dateOfBirth: string) => {
    const dateOfBirth = new Date(_dateOfBirth);
    const currentDate = new Date();

    // Calculate the difference in years
    let years = currentDate.getFullYear() - dateOfBirth.getFullYear();

    // Calculate the difference in months
    let months = currentDate.getMonth() - dateOfBirth.getMonth();

    // Calculate the difference in days
    let days = currentDate.getDate() - dateOfBirth.getDate();

    // Adjust if the day of birth is greater than the current day
    if (days < 0) {
      months--;
      const previousMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      );
      days += previousMonth.getDate(); // Get days in the previous month
    }

    // Adjust if the birth month is greater than the current month
    if (months < 0) {
      years--;
      months += 12;
    }

    setResult(() => ({ days, months, years }));
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValue(name as FormFields, value); // Set the value in react-hook-form
    setDob((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  function isValidDate() {
    const year: number = dob.year!;
    const month = dob.month!;
    const day = dob.day!;

    if (year && month && day) {
      // Create a date object with the given day, month (subtract 1 because months are 0-indexed), and year
      const date = new Date(year, month - 1, day);

      // Check if the date's month and year match the input values (i.e., valid date)
      const isValidDate =
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;

      return isValidDate;
    } else {
      return true;
    }
  }

  return (
    <>
      <main className="wrapper">
        <form
          onSubmit={handleSubmit(handleAge)}
          name="search-form"
          id="search-form"
        >
          <div className="container">
            <div className="input">
              <div className="form-group">
                <label
                  htmlFor="day"
                  className={errors?.day ? "error-text" : ""}
                >
                  Day
                </label>
                <input
                  type="number"
                  className={`input-control ${errors.day ? "border-red" : ""}`}
                  placeholder="DD"
                  {...register("day", {
                    required: "Must be a valid day",
                    pattern: { value: /\d[2]*/g, message: "Must be numbers" },
                    maxLength: {
                      value: 2,
                      message: "Must be 2 characters long",
                    },
                    min: 1,
                    max: 31,
                    onChange: (e) => handleOnChange(e),
                    validate: isValidDate,
                  })}
                />
                {errors.day && (
                  <span className="error-text fs-14 mt-12">
                    Must be a valid day
                  </span>
                )}
              </div>
              <div className="form-group">
                <label
                  htmlFor="month"
                  className={errors?.month ? "error-text" : ""}
                >
                  Month
                </label>
                <input
                  type="number"
                  className={`input-control ${
                    errors.month ? "border-red" : ""
                  }`}
                  placeholder="MM"
                  {...register("month", {
                    required: "Must be a valid month",
                    pattern: { value: /\d[2]*/g, message: "Must be numbers" },
                    maxLength: {
                      value: 2,
                      message: "Must be 2 characters long",
                    },
                    min: { value: 1, message: "Must be a valid month" },
                    max: { value: 12, message: "Must be a valid month" },
                    onChange: (e) => handleOnChange(e),
                  })}
                />
                {errors.month && (
                  <span className="error-text fs-14 mt-12">
                    {errors.month.message}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label
                  htmlFor="year"
                  className={errors?.year ? "error-text" : ""}
                >
                  Year
                </label>
                {JSON.stringify(errors.year?.types)}
                <input
                  type="number"
                  className={`input-control ${errors.year ? "border-red" : ""}`}
                  placeholder="YYYY"
                  {...register("year", {
                    required: "Must be a valid year",
                    pattern: { value: /\d[4]*/g, message: "Must be numbers" },
                    maxLength: {
                      value: 4,
                      message: "Must be 4 characters long",
                    },
                    min: 1,
                    max: {
                      value: new Date().getFullYear(),
                      message: "Must be in the past",
                    },
                    onChange: (e) => handleOnChange(e),
                  })}
                />

                {errors.year && (
                  <span className="error-text fs-14 mt-12">
                    {errors.year.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div
            className="divider"
            onClick={document?.forms?['search-form']?.submit()}
          >
            <button type="button">
              <img
                src="assets/images/icon-arrow.svg"
                alt="divider"
                className="divider-arrow"
              />
            </button>
          </div>
        </form>

        <div className="result">
          <p className="day">
            <span className="highlight">
              {result?.years ? result.years : "--"}
            </span>{" "}
            years
          </p>
          <p className="month">
            <span className="highlight">
              {result?.months ? result.months : "--"}
            </span>{" "}
            months
          </p>
          <p className="year">
            <span className="highlight">
              {result?.days ? result.days : "--"}
            </span>{" "}
            days
          </p>
        </div>
      </main>
    </>
  );
}

export default App;
