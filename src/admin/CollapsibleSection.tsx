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
      <h3 className={collapsed ? 'collapsed' : ''} onClick={toggle}>
        <>{title}</>
        <span>{collapsed ? <CaretRightOutlined /> : <CaretDownOutlined />}</span>
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
          background-color: #eaeaea;
          border: 2px solid #0000;
          border-radius: 3px;
          cursor: pointer;
          margin-bottom: 5px;
          padding: 5px;
          padding-left: 15px;
          padding-right: 10px;
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        h3.collapsed {
          border-color: #ccc;
        }

        h3:hover {
          background-color: rgb(220, 220, 255);
        }

        h3 span {
          color: #051537;
          opacity: 0.5;
        }

        label {
          opacity: 0.5;
          white-space: pre-line;
        }

        .expanded {
          margin-bottom: 50px;
        }
      `}</style>
    </div>
  )
}
