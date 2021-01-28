import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import { useReducer } from 'react'

export const CollapsibleSection = ({
  children,
  subtitle,
  title,
}: {
  children: JSX.Element | JSX.Element[]
  subtitle?: string
  title: string
}) => {
  const [collapsed, toggle] = useReducer((state) => !state, false)
  return (
    <div className="container">
      <h3 onClick={toggle}>
        <span>{collapsed ? <CaretRightOutlined /> : <CaretDownOutlined />}</span> {title}
      </h3>
      {!collapsed && (
        <div className="expanded">
          {subtitle && <label>{subtitle}</label>}
          {children}
        </div>
      )}
      <style jsx>{`
        div {
          margin-bottom: 20px;
        }

        h3 {
          background-color: rgba(244, 244, 255, 0.8);
          border: 1px solid rgba(190, 185, 255, 0.4);
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 5px;
          padding: 5px;
        }

        h3 span {
          color: #051537bb;
        }

        label {
          opacity: 0.5;
        }

        .expanded {
          margin-bottom: 50px;
        }
      `}</style>
    </div>
  )
}
