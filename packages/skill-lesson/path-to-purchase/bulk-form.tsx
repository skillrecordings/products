import React, {useState} from 'react'
import * as Dialog from '@radix-ui/react-dialog'

interface BulkFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  productName: string
}

const BulkForm: React.FC<BulkFormProps> = ({
  isOpen,
  onOpenChange,
  productName,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    seats: '',
    message: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {name, value} = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const {name, email, seats, message} = formData
    console.log('Form submitted:', {name, email, seats, message, productName})

    try {
      const response = await fetch('/api/skill/bulk-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          seats,
          message,
          productName,
        }),
      })

      const data = await response.json()
    } catch (error) {
      console.error('Error sending to Slack:', error)
    }

    onOpenChange(false)
  }

  return (
    <div data-bulk-form="">
      <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
        <Dialog.Overlay data-bulk-form-overlay="" />
        <Dialog.Content data-bulk-form-content="">
          <Dialog.Title data-bulk-form-title="">
            Contact Us for a Quote
          </Dialog.Title>
          <Dialog.Description data-bulk-form-description="">
            For orders of 50 or more seats, please fill out this form. We'll
            contact you with a custom quote.
          </Dialog.Description>
          <form onSubmit={handleSubmit}>
            <div data-bulk-form-name="">
              <label htmlFor="name">Name*</label>
              <input
                id="name"
                name="name"
                placeholder="Your preferred name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div data-bulk-form-email="">
              <label htmlFor="email">Email*</label>
              <input
                id="email"
                name="email"
                placeholder="you@example.com"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div data-bulk-form-num-seats="">
              <label htmlFor="seats">Number of Seats (Min 50)*</label>
              <input
                id="seats"
                name="seats"
                type="number"
                placeholder="50"
                min={50}
                value={formData.seats}
                onChange={handleInputChange}
                required
              />
            </div>
            <div data-bulk-form-message="">
              <label htmlFor="message">Additional Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="If you have any additional comments, please include them."
                rows={3}
                value={formData.message}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div data-bulk-form-actions="">
              <Dialog.Close asChild>
                <button type="button" data-bulk-form-button-cancel="">
                  Cancel
                </button>
              </Dialog.Close>
              <button type="submit" data-bulk-form-submit="">
                Submit
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}

export default BulkForm
