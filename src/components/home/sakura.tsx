import "./styles/sakura.scss";

function Sakura({ density }: { density: number }) {
  const number = density;

  return (
    <div className="sakura-animation">
      <div className="camera -x">
        <div className="camera -y">
          <div className="camera -z">
            {Array.from({ length: number }, (_, index) => (
              <div className="drop" key={index}>
                <div className="z">
                  <div className="slide">
                    <div className="move">
                      <div className="stagger">
                        <div className="reverse">
                          <div className="rotate">
                            <div className="size">
                              <div className="sakura"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sakura;
