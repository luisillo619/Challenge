import React from "react"
import {render, screen} from "@testing-library/react"
import "@testing-library/jest-dom"
import Pepe from "@/pages/prueba"

describe("Describe out pepe page", ()=>{
  beforeEach(()=>{

  })
    it("render property",()=>{
      render(<Pepe/>)
      const header = screen.getByText("pepe");
      const headerText = "pepe"

      expect(header).toHaveTextContent(headerText)
    })

    it("el boton esta desactivado",()=>{
      render(<Pepe/>)
      const buttonElement = screen.getByRole("button")
      expect(buttonElement).toBeDisabled()
    })
})