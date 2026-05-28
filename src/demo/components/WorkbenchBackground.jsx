/**
 * 合同管理平台工作台 — 静态背景（纯展示，无业务交互）
 * 基于参考截图结构用 HTML/CSS 复刻，不使用截图图片。
 */
export default function WorkbenchBackground() {
  return (
    <div className="wb-backdrop" aria-hidden>
      <header className="wb-backdrop__topbar">
        <div className="wb-backdrop__topbar-left">
          <span className="wb-backdrop__logo-mark" />
          <span className="wb-backdrop__platform-name">中国嘉德管理平台</span>
        </div>
        <div className="wb-backdrop__tabs">
          <span className="wb-backdrop__tab">标签页面1</span>
          <span className="wb-backdrop__tab">标签页面2</span>
          <span className="wb-backdrop__tab wb-backdrop__tab--active">标签页面3</span>
        </div>
        <div className="wb-backdrop__topbar-right">
          <span className="wb-backdrop__avatar">柳</span>
          <span className="wb-backdrop__user-name">柳叶刀</span>
          <span className="wb-backdrop__icon-pill" />
          <span className="wb-backdrop__icon-pill" />
        </div>
      </header>

      <div className="wb-backdrop__body">
        <aside className="wb-backdrop__sidebar">
          <div className="wb-backdrop__sidebar-brand">
            <span className="wb-backdrop__sidebar-logo" />
            <span>合同管理平台</span>
          </div>
          <nav className="wb-backdrop__menu">
            <div className="wb-backdrop__menu-item wb-backdrop__menu-item--active">工作台</div>
            <div className="wb-backdrop__menu-item">查询合同</div>
            <div className="wb-backdrop__menu-item">纸质合同</div>
            <div className="wb-backdrop__menu-item">草稿箱</div>
            <div className="wb-backdrop__menu-item">佣金维护</div>
            <div className="wb-backdrop__menu-item">另行约定时间维护</div>
            <div className="wb-backdrop__menu-item">打标管理</div>
          </nav>
        </aside>

        <div className="wb-backdrop__main">
          <div className="wb-backdrop__breadcrumb">合同管理平台 / 工作台</div>

          <div className="wb-backdrop__content-row">
            <div className="wb-backdrop__primary">
              <section className="wb-backdrop__card wb-backdrop__card--profile">
                <div className="wb-backdrop__profile-head">
                  <span className="wb-backdrop__profile-avatar">柳</span>
                  <div>
                    <div className="wb-backdrop__profile-name">柳叶刀</div>
                    <div className="wb-backdrop__profile-role">中国书画部 | 合同管理员</div>
                  </div>
                </div>
                <div className="wb-backdrop__subtabs">
                  <span className="wb-backdrop__subtab wb-backdrop__subtab--active">我的数据汇总</span>
                  <span className="wb-backdrop__subtab">书画部数据汇总</span>
                </div>
                <div className="wb-backdrop__stats">
                  <div className="wb-backdrop__stat">
                    <span className="wb-backdrop__stat-label">总合同</span>
                    <strong>556</strong>
                  </div>
                  <div className="wb-backdrop__stat">
                    <span className="wb-backdrop__stat-label">已签署</span>
                    <strong>56</strong>
                  </div>
                  <div className="wb-backdrop__stat">
                    <span className="wb-backdrop__stat-label">已作废</span>
                    <strong>0</strong>
                  </div>
                  <div className="wb-backdrop__stat">
                    <span className="wb-backdrop__stat-label">编辑中</span>
                    <strong>36</strong>
                  </div>
                </div>
              </section>

              <section className="wb-backdrop__card">
                <div className="wb-backdrop__quick-actions">
                  <div className="wb-backdrop__quick-tile wb-backdrop__quick-tile--blue">
                    <span className="wb-backdrop__quick-icon" />
                    <span>录入纸质合同</span>
                  </div>
                  <div className="wb-backdrop__quick-tile wb-backdrop__quick-tile--cyan">
                    <span className="wb-backdrop__quick-icon" />
                    <span>草稿箱</span>
                  </div>
                  <div className="wb-backdrop__quick-tile wb-backdrop__quick-tile--gold">
                    <span className="wb-backdrop__quick-icon" />
                    <span>新建用户</span>
                  </div>
                </div>
              </section>

              <section className="wb-backdrop__card">
                <div className="wb-backdrop__card-title">草稿箱</div>
                <div className="wb-backdrop__draft-list">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="wb-backdrop__draft-item">
                      <div className="wb-backdrop__draft-title">委托方电子合同</div>
                      <div className="wb-backdrop__draft-meta">
                        <span className="wb-backdrop__tag">待签署</span>
                        <span>委托人：罗文姬 | 更新时间：2023-12-10 12:00</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="wb-backdrop__filter">
              <div className="wb-backdrop__filter-field">
                <label>合同类型</label>
                <div className="wb-backdrop__select" />
              </div>
              <div className="wb-backdrop__filter-field">
                <label>入库拍期</label>
                <div className="wb-backdrop__select" />
              </div>
              <div className="wb-backdrop__filter-field">
                <label>预上拍拍期</label>
                <div className="wb-backdrop__select" />
              </div>
              <div className="wb-backdrop__filter-field">
                <label>委托人姓名</label>
                <div className="wb-backdrop__select" />
              </div>
              <div className="wb-backdrop__filter-field">
                <label>委托人ID</label>
                <div className="wb-backdrop__select" />
              </div>
              <div className="wb-backdrop__filter-actions">
                <span className="wb-backdrop__btn wb-backdrop__btn--ghost">重置</span>
                <span className="wb-backdrop__btn wb-backdrop__btn--primary">查询合同</span>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
