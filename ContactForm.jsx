import React, { useState } from "react";
import PrivacyData from "../assets/privacy/cookie-privacy.json";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateBack,
  faCircleXmark,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import cities from "../assets/contact/province-italia.json";
import ReactStars from "react-stars";
import axios from "axios";

// import this component inside your page
// add this component 

{/* <ContactForm 
NomeLanding='Landing Private'
Tipo='Cliente'
BaseInputs={[    
    { name: 'nome', required: true },
    { name: 'cognome', required: true},
    { name: 'email', required: true},
    { name: 'telefono', required: true},
    { name: 'nomeCognome', required: true},
]}
City={[{
     city: true, 
     required: true,
     cityName: 'Città',
     placeholder: 'Città'
}]}
DropDown={[{
    dropDown: true, 
    title:"seleziona almeno un'opzione", 
    defaultOption: 'default option', 
    disabled: false, 
    option1: 'opzione 1',
    option2: 'opzione 2',
    option3: 'opzione 3',
    required: true
}]}
Vote={[{
    vote: true, 
    name: 'Valuta la tue esperienza', 
    message: true, 
    required: true
}]}
Message={[{
    message: true, 
    required: true
}]}
ConsensoDati={[{
    consensoDati: true, 
    required: true,
    idPrivacy: 1
}]}
ConsensoNewsletter={[{
    consensoNewsletter: true, 
    listId: 0,
    required: false,
    idPrivacy: 3
}]}
SubmitButton={[{
    submitName:'invia', 
    submittedName:'inviato',
    submittingName:'Sto inviando...'
}]}
SuccessMessage={[{
    successMessage:'La tua richiesta è stata inoltrata con successo!', 
    successButton:'Visita il nostro sito!', 
    url:'https://www.careisgold.it/'
}]}
/> */}

function ContactForm(props) {

const itemWithId2 = PrivacyData.find((item) => item.id === props.ConsensoDati[0].idPrivacy);
const itemWithId3 = PrivacyData.find((item) => item.id === props.ConsensoNewsletter[0].idPrivacy);
const [baseInputs, setBaseInputs] = useState(props.BaseInputs);
const [rating, setRating] = useState(0);
const [newsLetterCheck, setNewsLetterCheck] = useState(false);
const [inputValue, setInputValue] = useState("");
const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
const [showModal, setShowModal] = useState(false);
const [showModal1, setShowModal1] = useState(false);
const [submitted, setSubmitted] = useState(false);
const [error, setError] = useState(null);
const [selectedOption, setSelectedOption] = useState("");
const [isSend, setIsSend] = useState(false);
const [isSended, setIsSended] = useState(false);


const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

function handleRatingChange(newRating) {
  setRating(newRating);                      
}

  const newsletterToggle = () => {
    if (newsLetterCheck === false) {
      setNewsLetterCheck(true);
    } else {
      setNewsLetterCheck(false);
    }
  };


  const goToCig = () => {
    setShowModal(false);
    window.location.href = props.SuccessMessage[0].url;
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeModal1 = () => {
    setShowModal1(false);
    window.location.reload();
  };

  const reload = () => {
    setShowModal(false);
    window.location.reload();
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    if (event.target.value !== "") {
      setIsSuggestionsVisible(true);
    }
  };

  const handleSuggestionClick = (event, city) => {
    setInputValue(city);
    setIsSuggestionsVisible(false);
  };

  const suggestions = cities
    .filter((city) =>
      city.comune.toLowerCase().startsWith(inputValue.toLowerCase())
    )
    .slice(0, 3)
    .map((city) => (
      <li className="text-decoration-none" key={city.comune}>
        <button
          className="border-0 bg-transparent text-dark text-opacity-75"
          onClick={(e) => handleSuggestionClick(e, city.comune)}
        >
          {city.comune}
        </button>
      </li>
    ));

    const getIdOrigin = () => {
      // Try to get 'IdOrigin' from local storage
      let idOrigin = localStorage.getItem('IdOrigin');
  
      // If 'IdOrigin' is not found in local storage, try cookies
      if (idOrigin === null) {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
          const [name, value] = cookie.split('=');
          if (name === 'IdOrigin') {
            idOrigin = value;
            break;
          }
        }
  
        // If 'IdOrigin' is not found in cookies, try session storage
        if (idOrigin === null) {
          idOrigin = sessionStorage.getItem('IdOrigin');
        }
      }
  
      return idOrigin;
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSend(!isSend);

    if (!submitted) {
      setSubmitted(true);

      const vnomeCognome = (document.getElementById("nomeCognome")?.value || '');
      const vnome = (document.getElementById("nome")?.value || '');
      const vcognome = (document.getElementById("cognome")?.value || '');
      const vzona = (document.getElementById("zonaprovenienza")?.value || '');
      const vtelefono = (document.getElementById("telefono")?.value || '');
      const vemail = (document.getElementById("email")?.value || '');
      const voptions = (document.getElementById("options")?.value || '');
      const vrating = rating; // Assuming rating is defined elsewhere in your code
      const vrecensione = (document.getElementById("recensione")?.value || '');
      const vmessaggio = (document.getElementById("messaggio")?.value || '');
      const vgioielleria = (document.getElementById("gioielleria")?.value || '');
      const idOrigineCliente = getIdOrigin();

      // landing private exception
      var privateCollaboratori = 0;
      
      if(voptions === "Senza esperienza"){
        privateCollaboratori = 15;
      }else if(voptions === "Professionista"){
        privateCollaboratori = 51;
      }

      // Create the additional data in the required format
      const additionalData = {
        NomeModulo: props.NomeLanding,
        Provenienza: idOrigineCliente,
        Dati: [
          {
            Key: "NomeCognome",
            Value: vnomeCognome,
          },
          {
            Key: "Nome",
            Value: vnome,
          },
          {
            Key: "Cognome",
            Value: vcognome,
          },
          {
            Key: "ZonaProvenienza",
            Value: vzona,
          },
          {
            Key: "Telefono",
            Value: vtelefono,
          },
          {
            Key: "Email",
            Value: vemail,
          },
          {
            Key: "Options",
            Value: voptions,
          },
          {
            Key: "Valutazione",
            Value: vrating,
          },
          {
            Key: "Recensione",
            Value: vrecensione,
          },
          {
            Key: "Messaggio",
            Value: vmessaggio,
          },
          {
            Key: "Tipo",
            Value: props.Tipo,
          },
          {
            Key: "Gioielleria",
            Value: vgioielleria,
          },
        ],
      };

      try {
        const response = await fetch("https://authcallhere/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            AppId: "youreappID",
            AppSecret: "youreAPPsecret",
          },
        });

        const data = await response.json();

        const token = data.Token;

        if (response.ok) {
          try {
            const res = await fetch(
              "https://yourecallhere",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  AppId: "youreappID",
                  Token: token,
                },
                body: JSON.stringify(additionalData),
              }
            );

            if (res.ok) {
              setTimeout(() => {
                setShowModal(true);
                setIsSended(true);
              }, 2500)



              if (newsLetterCheck) {

                let LIST_ID = props.ConsensoNewsletter[0].listId !== 'private' ? props.ConsensoNewsletter[0].listId : privateCollaboratori;
              
                const debug = () => {
                  console.log(LIST_ID)
                }
    
                const API_KEY =
                  "apikey-brevo";
    
                const email = vemail;
    
                const addContactToList = async (email) => {
                  const url = `https://api.brevo.com/v3/contacts`;
                  const data = {
                    email,
                    listIds: [LIST_ID],
                  };
                  const headers = {
                    "api-key": API_KEY,
                    "Content-Type": "application/json",
                  };
    
                  try {
                    const response = await axios.post(url, data, { headers });
                    console.log(response.data);
                  } catch (error) {
                    if (error.response && error.response.status === 400) {
                      const brevoUrl = `https://api.brevo.com/v3/contacts/lists/${LIST_ID}/contacts/add`;
                      const brevoData = {
                        emails: [`${email}`],
                      };
                      const brevoHeaders = {
                        "api-key": API_KEY,
                        "Content-Type": "application/json",
                      };
                      try {
                        const response = await axios.post(brevoUrl, brevoData, {
                          headers: brevoHeaders,
                        });
                        console.log(response.data);
                      } catch (brevoError) {
                        console.error(brevoError);
                      }
                    } else {
                      console.error(error);
                    }
                  }
                };
    
                addContactToList(email);
              }

            } else {
              setTimeout(() => {
                setShowModal1(true);
                setError(true);
              }, 2500)

              console.log("Errore invio modulo", res.status);
            }
          } catch (error) {
            console.log("Errore invio modulo", error);
            setTimeout(() => {
              setShowModal1(true);
              setError(true);
            }, 2500)


          }
        } else {
          console.error("Token Error:", response.status);
          setTimeout(() => {
            setShowModal1(true);
            setError(true);
          }, 2500)


        }
      } catch (error) {
        console.error("Token Error:", error);
        setTimeout(() => {
          setShowModal1(true);
          setError(true);
        }, 2500)


      }
    }
  };

  const inputFieldsAttributes  = [
    { 
      nomeCognome:{
        label: "Nome e Cognome",
        type:"text",
        id:"nomeCognome",
        autoComplete:"given-name",
        name:"nomeCognome",
        placeholder:"Nome e Cognome",
        pattern:"^[òàùèìa-zA-Z /']+$",
      },
      nome:{
        label: "Nome",
        id:'nome',
        type:'text',
        autoComplete:"given-name",
        name:'nome',
        placeholder:"Nome",
        pattern:"^[òàùèìa-zA-Z /']+$",
      },
      cognome:{
        label: "Cognome",
        id:'cognome',
        type:'text',
        autoComplete:"family-name",
        name:'cognome',
        placeholder:"Cognome",
        pattern:"^[òàùèìa-zA-Z /']+$",
      }, 
      telefono:{
        label: "Telefono",
        type:"text",
        id:"telefono",
        name:"telefono",
        autoComplete:"tel",
        placeholder:"Inserisci il tuo numero di telefono",
        pattern:"^\+?[0-9]{6,16}$",
      },
      email:{
        label: "Email",
        type:"text",
        id:"email",
        name:"email",
        autoComplete:"email",
        placeholder:"esempio@gmail.com",
        pattern:"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
      },
      gioielleria:{
        label: "Gioielleria",
        id:'gioielleria',
        type:'text',
        name:'gioielleria',
        placeholder:"Nome della Gioielleria",
        pattern:"^(?=.*[a-zA-Z])(?=.*\d)(?=.*\s)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).*$",
      }, 
    },
  ];



  function findAttributesForElements(dataArray, attributesArray) {
    const matchingAttributes = dataArray.map((data) => {
      const dataName = data.name;
      const matchingAttribute = attributesArray[0][dataName];
      
      if (matchingAttribute) {
        return {
          ...matchingAttribute,
          required: data.required,
          newLine: data.required ? true : false,
        };
      }
  
      return null;
    }).filter(Boolean);
  
    return matchingAttributes;
  }
  
  const matchingAttributes = findAttributesForElements(baseInputs, inputFieldsAttributes);

  // const debug = () => {
  //   console.log(props.Tipo)
  // }
    
  return (
    <div className="container-fluid" id="contact-form">
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-md-10 col-12 text-center">
          <form
            className="mt-3 mb-5 bg-light rounded-25"
            onSubmit={handleSubmit}
          >
            {/* <button onClick={debug}>debug</button> */}
            <div className="bg-secondary bg-opacity-10 rounded-25 px-4 py-3">

            {matchingAttributes.map((index) => (
                <>
                <div key={index}>
                    <label
                    className="d-flex justify-content-start align-items-center text-default mb-1 fs-5"
                    htmlFor={index.name}
                    >
                    {index.required ? (<span className="text-danger">*</span>):null}
                    &nbsp;{index.label}
                    </label>
                    <input
                    className="bg-white form-control mb-1"
                    type={index.type}
                    id={index.id}
                    autoComplete={index.autoComplete}
                    name={index.name}
                    placeholder={index.placeholder}
                    pattern={index.pattern}
                    required={index.required}
                    />
                </div>
                </>
            ))}
            {props.City[0].city ? (
                <>
                    <label
                    className="d-flex justify-content-start align-items-center text-default mb-1 fs-5"
                    htmlFor="zonaprovenienza"
                    >
                    <span className={`text-danger ${props.City[0].required ? '' : 'd-none' }`}>*</span>&nbsp;{props.City[0].cityName}
                    </label>
                    <input
                    type="text"
                    className="bg-white form-control mb-1"
                    id="zonaprovenienza"
                    autoComplete="city"
                    name="zonaprovenienza"
                    placeholder={props.City[0].placeholder}
                    pattern="^[òàùèìa-zA-Z /']+$"
                    value={inputValue}
                    onChange={handleInputChange}
                    required={props.City[0].required}
                    />
                    {isSuggestionsVisible && (
                    <ul className="list-unstyled text-start">{suggestions}</ul>
                    )}
                </>
            ):null}

            {props.DropDown[0].dropDown ? (
                <>
                    <label
                    className="d-flex justify-content-start align-items-center text-default fs-5"
                    htmlFor="object"
                    >
                    <span className={`text-danger ${props.DropDown[0].required ? '' : 'd-none' }`}>*</span>&nbsp;
                    {props.DropDown[0].title}
                    </label>
                    <select
                    className="form-select mt-1"
                    id="options"
                    onChange={handleOptionChange}
                    required={props.DropDown[0].required}
                    >
                    <option value={props.DropDown[0].defaultOption} selected disabled={props.DropDown[0].disabled}>
                        {props.DropDown[0].defaultOption}
                    </option>
                    <option className={`${props.DropDown[0].option1 ? 'd-block' : 'd-none' }`} value={props.DropDown[0].option1}>{props.DropDown[0].option1}</option>
                    <option className={`${props.DropDown[0].option2 ? 'd-block' : 'd-none' }`} value={props.DropDown[0].option2}>{props.DropDown[0].option2}</option>
                    <option className={`${props.DropDown[0].option3 ? 'd-block' : 'd-none' }`} value={props.DropDown[0].option3}>{props.DropDown[0].option3}</option>
                    </select>
                </>
            ):null}

            {props.Vote[0].vote ? (
                <>
                    <label className="d-flex justify-content-start align-items-center text-default mt-3 fs-5" htmlFor="rating">
                    <span className={`text-danger ${props.Vote[0].required ? '' : 'd-none' }`}>*</span>&nbsp;{props.Vote[0].name}</label>
                    <ReactStars
                        count={5}
                        value={rating}
                        size={40}
                        half={false}
                        color2={"#DBBE6F"}
                        color1={"#B3B3B3"}
                        onChange={handleRatingChange}
                        className="mb-1"
                    />
                {props.Vote[0].message ? (
                    <>
                    <textarea
                        className="pb-5 bg-white form-control mb-1"
                        id="recensione"
                        name="messaggio"
                        placeholder={props.Vote[0].placeholder}
                        pattern="^[òàùèìa-zA-Z0-9\ *'\.\,\;\:\?\!\(\)]+$"
                        required={props.Vote[0].required}
                    />
                    </>
                ):null}
                </>
            ):null}

            {props.Message[0].message ? (
                <>
                    <label className="d-flex justify-content-start align-items-center text-default fs-5 my-1" for="object"><span className={`text-danger ${props.Message[0].required ? '' : 'd-none' }`}>*</span>&nbsp;{props.Message[0].messageName}</label>                         
                    <textarea
                        className="pb-5 bg-white form-control mb-3"
                        id="messaggio"
                        name="messaggio"
                        placeholder={props.Message[0].placeholder}
                        pattern="^[òàùèìa-zA-Z0-9\ *'\.\,\;\:\?\!\(\)]+$"
                        required={props.Message[0].required}
                    />
                </>
            ):null}

            <div className="row d-flex justify-content-center align-items-center mt-4">
            {props.ConsensoDati[0].consensoDati ? (
            <>
              <div className="col-12 text-start">
                <label className="switch">
                  <input
                    type="checkbox"
                    id="consensoDati"
                    className="form-check-input"
                    required={props.ConsensoDati[0].required}
                  />
                  <span className="slider round" />
                </label>
                <a
                  href="/"
                  className="text-default text-decoration-none ms-1"
                  data-bs-toggle="modal"
                  data-bs-target="#exempleModal"
                >
                  <span className={`text-danger ms-1 ${props.ConsensoDati[0].required ? '' : 'd-none' }`}>*</span>&nbsp;consenso dati
                </a>
              </div>
            </>
            ):null}

            {props.ConsensoNewsletter[0].consensoNewsletter ? (
            <>
                <div className="col-12 text-start mt-2">
                    <label className="switch">
                    <input
                        type="checkbox"
                        id="consensoDati"
                        className="form-check-input"
                        onChange={newsletterToggle}
                        required={props.ConsensoNewsletter[0].required}
                    />
                    <span className="slider round" />
                    </label>
                    <a
                    href="/"
                    className="text-default text-decoration-none ms-1"
                    data-bs-toggle="modal"
                    data-bs-target="#exempleModal2"
                    >
                    <span className={`text-danger ${props.ConsensoNewsletter[0].required ? '' : 'd-none' }`}>*</span>
                    &nbsp;consenso dati newsletter
                    </a>
                </div>
            </>
            ):null}

              <div className="col-8 col-sm-6">
                <button className={`btn-airplane rounded mt-4 ${isSend && !isSended ? 'send' : ''} ${isSended ? 'sended' : ''}`} type="submit" id="inviaDati">
                    <span className="text fs-5">{props.SubmitButton[0].submitName}</span>
                    <span className="send fs-5">{props.SubmitButton[0].submittingName}</span>
                    <span className="sended fs-5">{props.SubmitButton[0].submittedName}</span>
                    <span className="icon ms-2">
                        <FontAwesomeIcon icon="f-solid fa-paper-plane" className="fs-5 airplane-icon"/>
                    </span>
                </button>
              </div>
            </div>
            </div>
          </form>
          
          {submitted && !error ? (
                <>
                <div className="container" id="thankyouPage">
                <Modal show={showModal} centered backdrop={true} className="d-flex" onHide={closeModal}>
                    <Modal.Body className="col-12 col-md-6">
                      <div className="container-fluid mb-4 alert-success">
                        <div
                          className="row text-center justify-content-center align-items-center"
                        >
                          <div
                            className="col-12 alert text-center"
                            role="alert"
                          >
                            <div className="col-12 text-center my-2">
                              <i className="fa-solid fa-circle-check display-3 me-auto"></i>
                            </div>
                            <div className="col-12">
                              <p className="fs-5 fw-bold text-center">
                                {props.SuccessMessage[0].successMessage}
                              </p>
                            </div>
                            <button
                              onClick={goToCig}
                              className="btn-default px-3 py-2 rounded"
                            >
                              <FontAwesomeIcon
                                className="me-2"
                                icon={faGlobe}
                              />
                                {props.SuccessMessage[0].successButton}
                            </button>
                          </div>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
              </>
          ) : submitted && error ? (
                <>
                <div className="container" id="errorPage">
                <Modal show={showModal1} centered backdrop={true} className="d-flex" onHide={closeModal1}>
                    <Modal.Body className="col-12 col-md-6">
                      <div className="container-fluid mb-4 alert-danger">
                        <div
                          className="row text-center justify-content-center align-items-center"
                        >
                          <div
                            className="col-12 alert text-center"
                            role="alert"
                          >
                            <div className="col-12 text-center my-2">
                              <FontAwesomeIcon
                                className="me-2 display-3"
                                icon={faCircleXmark}
                              />
                            </div>
                            <div className="col-12">
                              <p className="fs-5 fw-bold text-center">
                                Si è verificato un problema nell'invio.
                              </p>
                            </div>
                            <button
                              onClick={reload}
                              className="btn-default px-3 py-2 rounded"
                            >
                              <FontAwesomeIcon
                                className="me-2"
                                icon={faArrowRotateBack}
                              />
                              Riprova
                            </button>
                          </div>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
              </>
          ): null}

          <div className="container">
            <div className="row d-flex justify-content-center align-items-center">
              <div
                className="modal fade"
                id="exempleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-scrollable d-flex justify-content-center align-items-center">
                  <div
                    className="modal-content"
                    style={{ width: "95%", height: "70%" }}
                  >
                    <div className="modal-header text-center">
                      <h6
                        className="modal-title text-default fw-semibold fs-6"
                        id="staticBackdropLabel"
                      >
                        {itemWithId2.title}
                      </h6>
                      <button
                        className="btn-close"
                        type="button"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body text-start">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: itemWithId2.content,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            {/* consenso newsletter */}
            <div
                className="modal fade"
                id="exempleModal2"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
                >
                <div className="modal-dialog modal-dialog-scrollable d-flex justify-content-center align-items-center">
                    <div
                    className="modal-content"
                    style={{ width: "95%", height: "70%" }}
                    >
                    <div className="modal-header text-center">
                        <h6
                        className="modal-title text-default fw-semibold fs-6"
                        id="staticBackdropLabel"
                        >
                        {itemWithId3.title}
                        </h6>
                        <button
                        className="btn-close"
                        type="button"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body text-start">
                        <div
                        dangerouslySetInnerHTML={{
                            __html: itemWithId3.content,
                        }}
                        />
                    </div>
                    </div>
                </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
