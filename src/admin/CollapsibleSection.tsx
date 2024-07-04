import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import { useReducer } from 'react'

export const CollapsibleSection = ({ children, title }: { children: JSX.Element | JSX.Element[]; title: string }) => {
  const [collapsed, toggle] = useReducer((state) => !state, false)
  return (
    <section>
      <h3 className={collapsed ? 'collapsed' : ''} onClick={toggle}>
        <>{title}</>
        <span>{collapsed ? <CaretRightOutlined /> : <CaretDownOutlined />}</span>
      </h3>
      {!collapsed && <div className="expanded">{children}</div>}
      <style jsx>{`
        div,
        section {
          margin-bottom: 20px;
        }

        h3 {
          background-color: #ededed;
          border: 1px solid #00286800;
          border-radius: 2px;
          cursor: pointer;
          margin-bottom: 5px;
          padding: 5px;
          padding-left: 15px;
          padding-right: 10px;
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        h3:hover {
          background-color: #f1f1ff;
          border-color: #00286811;
        }

        h3.collapsed {
          border-color: #00286844;
        }

        h3.collapsed:hover {
          border-color: #00286833;
        }

        h3 span {
          color: #051537;
          opacity: 0.5;
        }

        .expanded {
          margin-bottom: 50px;
        }
      `}</style>
    </section>
  )
}
