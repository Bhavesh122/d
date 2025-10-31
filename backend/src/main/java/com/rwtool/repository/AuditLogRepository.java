package com.rwtool.repository;

import com.rwtool.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    // Find logs by user email
    List<AuditLog> findByUserEmailContainingIgnoreCase(String userEmail);
    
    // Find logs by action
    List<AuditLog> findByAction(String action);
    
    // Find logs by role
    List<AuditLog> findByRole(String role);
    
    // Find logs by status
    List<AuditLog> findByStatus(String status);
    
    // Find logs within date range
    List<AuditLog> findByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find recent logs (limit)
    List<AuditLog> findTop10ByOrderByTimestampDesc();
    
    // Complex search with filters
    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:userEmail IS NULL OR LOWER(a.userEmail) LIKE LOWER(CONCAT('%', :userEmail, '%'))) AND " +
           "(:action IS NULL OR a.action = :action) AND " +
           "(:role IS NULL OR a.role = :role) AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:startDate IS NULL OR a.timestamp >= :startDate) AND " +
           "(:endDate IS NULL OR a.timestamp <= :endDate) AND " +
           "(:searchTerm IS NULL OR (" +
           "LOWER(a.details) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.userEmail) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.action) LIKE LOWER(CONCAT('%', :searchTerm, '%'))))")
    Page<AuditLog> findWithFilters(@Param("userEmail") String userEmail,
                                   @Param("action") String action,
                                   @Param("role") String role,
                                   @Param("status") String status,
                                   @Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate,
                                   @Param("searchTerm") String searchTerm,
                                   Pageable pageable);
}
